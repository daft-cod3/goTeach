"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DM_Sans, Space_Grotesk } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

const STORAGE_KEY = "goTeachContentUploads";
const STORAGE_PLAN_KEY = "goTeachStoragePlan";
const BASE_STORAGE_BYTES = 50 * 1024 * 1024;
const UPGRADED_STORAGE_BYTES = 1024 * 1024 * 1024;

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(bytes)) return "0 MB";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const precision = size >= 10 || unitIndex === 0 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
};

const generateId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getExtension = (name = "") => name.split(".").pop()?.toLowerCase();

const isVideoAsset = (file) => {
  if (!file) return false;
  if (file.type?.startsWith("video/")) return true;
  const ext = getExtension(file.name);
  return ["mp4", "mov", "mkv", "webm", "avi"].includes(ext);
};

const getFileLabel = (file) => {
  if (!file) return "File";
  if (file.type?.startsWith("video/")) return "Video";
  if (file.type?.startsWith("image/")) return "Image";
  const name = file.name || "";
  const ext = getExtension(name);
  if (ext === "pdf") return "PDF";
  if (ext === "ppt" || ext === "pptx") return "PPT";
  if (ext === "xls" || ext === "xlsx" || ext === "csv") return "Spreadsheet";
  if (ext === "doc" || ext === "docx") return "Document";
  return "File";
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Uploaded just now";
  const timestamp = new Date(dateString).getTime();
  if (Number.isNaN(timestamp)) return "Uploaded just now";
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.max(1, Math.round(diffMs / 60000));
  if (diffMins < 60) {
    return `Uploaded ${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  }
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) {
    return `Uploaded ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) {
    return `Uploaded ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  }
  const displayDate = new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return `Uploaded on ${displayDate}`;
};

const buildUploadEntry = (file) => {
  const uploadedAt = new Date().toISOString();
  return {
    id: generateId(),
    title: file.name,
    type: getFileLabel(file),
    size: formatBytes(file.size),
    sizeBytes: file.size,
    uploadedAt,
    time: formatRelativeTime(uploadedAt),
    isVideo: isVideoAsset(file),
  };
};

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLiveOpen, setIsLiveOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [stream, setStream] = useState(null);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [recordedFile, setRecordedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [contentUploadError, setContentUploadError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [uploads, setUploads] = useState([]);
  const [isUpgradedPlan, setIsUpgradedPlan] = useState(false);
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const hydrated = parsed.map((item) => ({
          ...item,
          id: item.id || generateId(),
          type: item.type || "File",
          sizeBytes: Number(item.sizeBytes) || 0,
          isVideo:
            typeof item.isVideo === "boolean"
              ? item.isVideo
              : item.type === "Video",
          time: formatRelativeTime(item.uploadedAt),
        }));
        setUploads(hydrated);
      }
    } catch {
      setUploads([]);
    }
  }, []);

  useEffect(() => {
    const storedPlan = localStorage.getItem(STORAGE_PLAN_KEY);
    if (storedPlan === "upgraded") {
      setIsUpgradedPlan(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
  }, [uploads]);

  const storageLimitBytes = isUpgradedPlan
    ? UPGRADED_STORAGE_BYTES
    : BASE_STORAGE_BYTES;
  const usedBytes = uploads.reduce(
    (total, item) => total + (item.sizeBytes || 0),
    0,
  );
  const remainingBytes = Math.max(0, storageLimitBytes - usedBytes);

  const handleUploadChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const incomingBytes = files.reduce((total, file) => total + file.size, 0);
    if (usedBytes + incomingBytes > storageLimitBytes) {
      setContentUploadError(
        `Storage limit reached. ${formatBytes(
          remainingBytes,
        )} free. Upgrade to add more.`,
      );
      return;
    }

    setContentUploadError("");
    setSelectedFiles(files.map((file) => file.name));
    const nextUploads = files.map(buildUploadEntry);
    setUploads((prev) => [...nextUploads, ...prev]);
  };

  const startPreview = async () => {
    setMediaError("");
    if (stream) {
      return;
    }
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      setMediaError(
        "Camera or microphone access was blocked. Please allow permissions and try again."
      );
    }
  };

  const startRecording = async () => {
    if (typeof MediaRecorder === "undefined") {
      setMediaError("Recording is not supported in this browser.");
      return;
    }

    if (!stream) {
      await startPreview();
    }
    if (!stream) {
      return;
    }

    const preferredTypes = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    let mimeType = "";
    for (const type of preferredTypes) {
      if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }

    try {
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "video/webm",
        });
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `live-session-${timestamp}.webm`;
        const file = new File([blob], fileName, {
          type: mimeType || "video/webm",
        });
        const url = URL.createObjectURL(blob);
        setRecordingUrl(url);
        setRecordedFile(file);
        setShareUrl("");
        setUploadError("");
        setIsFinalizing(false);
      };
      recorder.start(1000);
      recorderRef.current = recorder;
      setIsRecording(true);
      setIsPaused(false);
      setIsFinalizing(false);
    } catch (error) {
      setMediaError("Recording failed to start on this browser.");
    }
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      setIsFinalizing(true);
      try {
        if (typeof recorder.requestData === "function") {
          recorder.requestData();
        }
      } catch (error) {
        // Ignore requestData errors and proceed to stop.
      }
      recorder.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  const togglePauseRecording = () => {
    const recorder = recorderRef.current;
    if (!recorder) {
      return;
    }
    if (recorder.state === "recording" && typeof recorder.pause === "function") {
      recorder.pause();
      setIsPaused(true);
    } else if (recorder.state === "paused" && typeof recorder.resume === "function") {
      recorder.resume();
      setIsPaused(false);
    }
  };

  const closeLive = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (recordingUrl) {
      URL.revokeObjectURL(recordingUrl);
    }
    setStream(null);
    setRecordingUrl("");
    setIsRecording(false);
    setMediaError("");
    setRecordedFile(null);
    setIsUploading(false);
    setUploadError("");
    setShareUrl("");
    setCopyStatus("");
    setIsFinalizing(false);
    setIsLiveOpen(false);
  };

  const handleUploadRecording = async () => {
    if (!recordedFile) {
      return;
    }
    setIsUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("file", recordedFile);
      const response = await fetch("/api/recordings", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const data = await response.json();
      setShareUrl(data.shareUrl || data.url || "");
    } catch (error) {
      setUploadError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("Link copied.");
    } catch (error) {
      setCopyStatus("Could not copy link.");
    }
  };

  const handleDeviceShare = async () => {
    if (!navigator.share) {
      setCopyStatus("Share is not supported on this device.");
      return;
    }
    const title = "Live session recording";
    const text = "Live session recording from GoDomain Teacher.";
    try {
      if (shareUrl) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      if (recordedFile && navigator.canShare?.({ files: [recordedFile] })) {
        await navigator.share({ title, text, files: [recordedFile] });
      } else {
        setCopyStatus("Upload the recording to share a link.");
      }
    } catch (error) {
      setCopyStatus("Share canceled.");
    }
  };

  const handleInstagramShare = async () => {
    if (!shareUrl) {
      return;
    }
    await handleCopyLink();
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (recordingUrl) {
        URL.revokeObjectURL(recordingUrl);
      }
    };
  }, [stream, recordingUrl]);

  const recordedUploads = uploads.filter((item) => item.isVideo);
  const recordedCount = recordedUploads.length;
  const recordedSize = recordedUploads.reduce(
    (total, item) => total + (item.sizeBytes || 0),
    0,
  );
  const imageUploads = uploads.filter((item) => item.type === "Image");
  const imageCount = imageUploads.length;
  const imageSize = imageUploads.reduce(
    (total, item) => total + (item.sizeBytes || 0),
    0,
  );
  const notesUploads = uploads.filter(
    (item) => !item.isVideo && item.type !== "Image",
  );
  const notesCount = notesUploads.length;
  const notesSize = notesUploads.reduce(
    (total, item) => total + (item.sizeBytes || 0),
    0,
  );

  const hubCards = [
    {
      title: "Behind-the-Wheel Sessions",
      description: `${recordedCount} ${
        recordedCount === 1 ? "video" : "videos"
      } - ${formatBytes(recordedSize)}`,
      color: "from-indigo-500 to-violet-500",
    },
    {
      title: "Theory Notes & Handouts",
      description: `${notesCount} ${notesCount === 1 ? "file" : "files"} - ${formatBytes(
        notesSize,
      )}`,
      color: "from-emerald-400 to-teal-500",
    },
    {
      title: "Road Signs & Diagrams",
      description: `${imageCount} ${
        imageCount === 1 ? "visual" : "visuals"
      } - ${formatBytes(imageSize)}`,
      color: "from-rose-400 to-orange-400",
    },
    {
      title: "Test Prep Links",
      description: "",
      color: "from-slate-600 to-slate-800",
    },
  ];

  return (
    <div
      className={`${dmSans.className} ${spaceGrotesk.variable} min-h-screen bg-[radial-gradient(circle_at_top,_#f2ecff_0%,_#f7f2ff_35%,_#fef8f3_70%,_#ffffff_100%)] text-slate-900`}
    >
      <div className="relative flex min-h-screen w-full gap-6 px-6 py-8 lg:px-10">
        <aside className="hidden w-60 flex-col gap-6 rounded-[28px] bg-white/80 p-6 shadow-[0_18px_60px_-30px_rgba(40,26,90,0.35)] backdrop-blur lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 via-orange-300 to-amber-200 text-white shadow-md">
              <span className="text-lg font-semibold">GD</span>
            </div>
            <div>
              <p className="font-semibold tracking-tight">GoDomain</p>
              <p className="text-xs text-slate-500">Teacher workspace</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 text-sm font-medium text-slate-600">
            {[
              { label: "Dashboard", href: "/" },
              { label: "Students", href: "/" },
              { label: "Progress Tracking", href: "/progTrack" },
              { label: "Assessments", href: "/" },
              { label: "Live Sessions", href: "/" },
              { label: "Attendance", href: "/" },
              { label: "Content Hub", href: "/content" },
              { label: "Reports", href: "/" },
            ].map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                  index === 0
                    ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400 text-white shadow-md"
                    : "hover:bg-white/60"
                }`}
              >
                <span>{item.label}</span>
                {index === 0 ? (
                  <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] uppercase tracking-wide">
                    Live
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="mt-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
            <p className="text-sm font-semibold">Upgrade to GoDomain Pro</p>
            <p className="mt-2 text-xs text-slate-200">
              Unlock advanced analytics, auto feedback, and larger storage for
              your classes.
            </p>
            <button className="mt-4 w-full rounded-2xl bg-white/15 py-2 text-xs font-semibold uppercase tracking-wide">
              Upgrade now
            </button>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white/80 px-6 py-4 shadow-[0_18px_50px_-35px_rgba(28,20,56,0.45)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                GoDomain Teacher
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Good evening, Coach Diala
              </h1>
            </div>
            <div className="flex flex-1 items-center justify-center gap-3 md:justify-end">
              <div className="relative hidden w-full max-w-md md:block">
                <input
                  className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-inner outline-none focus:border-indigo-200"
                  placeholder="Search classes, students, or content"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                  Ctrl K
                </span>
              </div>
              <button
                className="rounded-2xl bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white"
                onClick={() => {
                  setIsLiveOpen(true);
                  startPreview();
                }}
              >
                Live Session
              </button>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400" />
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-700">Diala Salim</p>
                  <p className="text-slate-400">Biology - Grade 9</p>
                </div>
              </div>
            </div>
          </header>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 p-8 text-white shadow-[0_25px_70px_-40px_rgba(90,60,160,0.75)]">
                <div className="max-w-md">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
                    Driving Instructor Dashboard
                  </p>
                  <h2
                    className="mt-3 text-3xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Keep every learner road-ready and confident.
                  </h2>
                  <p className="mt-3 text-sm text-indigo-100">
                    Track lesson progress, road test readiness, and share
                    driving resources from one calm, beautiful workspace.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-indigo-700">
                      Create quick quiz
                    </button>
                    <button className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white">
                      View learner insights
                    </button>
                  </div>
                </div>
                <div className="absolute right-8 top-1/2 hidden h-44 w-44 -translate-y-1/2 rounded-[40px] bg-white/20 blur-sm lg:block" />
                <div className="absolute -right-10 -top-8 h-24 w-24 rounded-3xl bg-white/20" />
                <div className="absolute -bottom-8 right-16 h-20 w-20 rounded-full bg-white/10" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Progress tracking
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Lesson checkpoint scores
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      +8% this week
                    </span>
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    {[40, 62, 55, 78, 86, 92, 70].map((value, index) => (
                      <div
                        key={`${value}-${index}`}
                        className="flex-1 rounded-2xl bg-indigo-100"
                        style={{ height: `${value}px` }}
                      >
                        <div
                          className="h-full rounded-2xl bg-gradient-to-t from-indigo-500 to-fuchsia-400"
                          style={{ height: `${value}px` }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>Avg. score 86%</span>
                    <span>98 check-ins logged</span>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Progress tracking
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Lesson plan monitor
                      </h3>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      12 plans active
                    </span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        label: "City driving module",
                        value: 78,
                        color: "from-emerald-400 to-teal-500",
                      },
                      {
                        label: "Highway merge drills",
                        value: 64,
                        color: "from-indigo-400 to-violet-500",
                      },
                      {
                        label: "Parking & turns mastery",
                        value: 86,
                        color: "from-rose-400 to-orange-400",
                      },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{item.label}</span>
                          <span className="font-semibold text-slate-700">
                            {item.value}%
                          </span>
                        </div>
                        <div className="mt-2 h-2.5 rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                    <span>On-track: 81%</span>
                    <span>Needs focus: 11%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Driving school content hub
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Share lesson videos, checklists, and road rules
                    </h3>
                  </div>
                  <label
                    htmlFor="dashboard-upload"
                    className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                  >
                    Upload new content
                    <input
                      id="dashboard-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt,.zip,.rar"
                      className="sr-only"
                      onChange={handleUploadChange}
                    />
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: {selectedFiles.join(", ")}
                  </p>
                )}
                {contentUploadError && (
                  <p className="mt-2 text-xs font-semibold text-rose-500">
                    {contentUploadError}
                  </p>
                )}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {hubCards.map((item) => (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-slate-100 bg-white/60 p-4 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div
                        className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${item.color}`}
                      />
                      <h4 className="mt-3 text-sm font-semibold text-slate-800">
                        {item.title}
                      </h4>
                      {item.description ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {item.description}
                        </p>
                      ) : (
                        <div className="mt-4" />
                      )}
                      <button className="mt-4 text-xs font-semibold text-indigo-600">
                        Manage library
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Feedback
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Learner messages
                    </h3>
                  </div>
                  <button className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600">
                    New
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { name: "K. Onyango", note: "Needs help with roundabouts" },
                    { name: "S. Patel", note: "Submitted logbook early" },
                    { name: "L. Novak", note: "Requested night driving recap" },
                  ].map((student) => (
                    <div
                      key={student.name}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-400">{student.note}</p>
                      </div>
                      <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                        Message
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-500">
                    Send quick feedback
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-500 outline-none focus:border-indigo-200"
                      placeholder="Type a note to selected learners"
                    />
                    <button className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                      Send
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Learning pulse
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Learner engagement
                    </h3>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">
                    89% active
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Lesson attendance", value: "18/20" },
                    { label: "Theory completion", value: "92%" },
                    { label: "Safety questions", value: "11 today" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600"
                    >
                      <span>{item.label}</span>
                      <span className="text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 text-white shadow-[0_25px_70px_-40px_rgba(10,10,20,0.8)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Next lesson
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Highway Merge Practice
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  Thursday - 3:30 PM - Lot B
                </p>
                <div className="mt-5 flex items-center gap-2">
                  <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
                    Join session
                  </button>
                  <button className="rounded-full border border-white/30 px-4 py-2 text-xs font-semibold text-white">
                    Share invite
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
      {isLiveOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 py-8">
          <div className="w-full max-w-3xl rounded-[28px] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(20,20,40,0.7)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Go Live
                </p>
                <h3 className="text-lg font-semibold text-slate-900">
                  Live session recording
                </h3>
              </div>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                onClick={closeLive}
              >
                Close
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <video
                ref={videoRef}
                className="h-[320px] w-full bg-black object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>

            {mediaError ? (
              <p className="mt-3 text-xs text-rose-500">{mediaError}</p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                className={`rounded-full px-4 py-2 text-xs font-semibold text-white ${
                  isRecording ? "bg-slate-300" : "bg-slate-900"
                }`}
                onClick={startRecording}
                disabled={isRecording}
              >
                Start recording
              </button>
              <button
                className={`rounded-full px-4 py-2 text-xs font-semibold text-white ${
                  isRecording ? "bg-rose-500" : "bg-rose-300"
                }`}
                onClick={stopRecording}
                disabled={!isRecording}
              >
                Stop recording
              </button>
              <button
                className={`rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold ${
                  isRecording ? "text-slate-600" : "text-slate-300"
                }`}
                onClick={togglePauseRecording}
                disabled={!isRecording}
              >
                {isPaused ? "Resume" : "Pause"}
              </button>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                onClick={startPreview}
              >
                Refresh preview
              </button>
            </div>

            {isFinalizing ? (
              <p className="mt-4 text-xs text-slate-500">
                Finalizing recording...
              </p>
            ) : null}

            {recordingUrl ? (
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  After recording (recommended)
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Recommended: upload or share the recording to reach students.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={recordingUrl}
                    download={recordedFile?.name || "live-session.webm"}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
                  >
                    Download recording
                  </a>
                  <button
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    onClick={handleUploadRecording}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload recording"}
                  </button>
                  <button
                    className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                    onClick={handleDeviceShare}
                    disabled={!recordedFile}
                  >
                    Share via device
                  </button>
                </div>

                {uploadError ? (
                  <p className="mt-2 text-xs text-rose-500">{uploadError}</p>
                ) : null}

                {shareUrl ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-600">
                      Share link
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <input
                        readOnly
                        value={shareUrl}
                        className="w-full flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"
                      />
                      <button
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                        onClick={handleCopyLink}
                      >
                        Copy link
                      </button>
                    </div>
                    {copyStatus ? (
                      <p className="mt-2 text-xs text-slate-500">
                        {copyStatus}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Live session recording from GoDomain Teacher. ${shareUrl}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          "Live session recording from GoDomain Teacher."
                        )}&url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        X
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          shareUrl
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        Facebook
                      </a>
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(
                          shareUrl
                        )}&text=${encodeURIComponent(
                          "Live session recording from GoDomain Teacher."
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        Telegram
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          shareUrl
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                      >
                        LinkedIn
                      </a>
                      <button
                        className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                        onClick={handleInstagramShare}
                      >
                        Instagram
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">
                      Instagram web does not support direct link sharing. The
                      button copies the link and opens Instagram.
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">
                    Upload to generate a shareable link.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
const MB = 1024 * 1024;
const GB = 1024 * MB;
const STORAGE_PLANS = [
  {
    id: "free",
    label: "Free",
    bytes: 50 * MB,
    detail: "50 MB storage · Unlimited uploads",
    price: "KES 0",
  },
  {
    id: "pro-5gb",
    label: "Plus 5 GB",
    bytes: 5 * GB,
    detail: "5 GB storage · Unlimited uploads",
    price: "KES 500",
  },
  {
    id: "pro-10gb",
    label: "Pro 10 GB",
    bytes: 10 * GB,
    detail: "10 GB storage · Unlimited uploads",
    price: "KES 1,000",
  },
];

const feedbackStudents = [
  { id: "stu-001", name: "Abena Kofi", classCode: "B1" },
  { id: "stu-002", name: "Musa Diallo", classCode: "A2" },
  { id: "stu-003", name: "Lara Juma", classCode: "C1" },
  { id: "stu-004", name: "Hassan Okoye", classCode: "D2" },
  { id: "stu-005", name: "Ama Mensah", classCode: "B2" },
  { id: "stu-006", name: "Kwame Owusu", classCode: "C2" },
  { id: "stu-007", name: "Zara Ncube", classCode: "A1" },
  { id: "stu-008", name: "Yao Toure", classCode: "B3" },
  { id: "stu-009", name: "Nia Kamau", classCode: "C3" },
  { id: "stu-010", name: "Omar Ali", classCode: "D1" },
  { id: "stu-011", name: "Lina Hassan", classCode: "B1" },
  { id: "stu-012", name: "Tariq Malik", classCode: "A2" },
  { id: "stu-013", name: "Sade Okoro", classCode: "C1" },
  { id: "stu-014", name: "Eli Mensah", classCode: "B2" },
  { id: "stu-015", name: "Naomi Boateng", classCode: "A1" },
  { id: "stu-016", name: "Kofi Asare", classCode: "C2" },
  { id: "stu-017", name: "Amina Yusuf", classCode: "D1" },
  { id: "stu-018", name: "Chidi Nwosu", classCode: "B3" },
  { id: "stu-019", name: "Eshe Okafor", classCode: "C3" },
  { id: "stu-020", name: "Jacob Njeri", classCode: "A2" },
  { id: "stu-021", name: "Ruth Agyemang", classCode: "B1" },
  { id: "stu-022", name: "Farah Abdi", classCode: "D2" },
  { id: "stu-023", name: "Samir Idris", classCode: "A1" },
  { id: "stu-024", name: "Nana Prempeh", classCode: "C1" },
  { id: "stu-025", name: "Fatima Noor", classCode: "B2" },
  { id: "stu-026", name: "Kojo Mensa", classCode: "C2" },
  { id: "stu-027", name: "Laila Abbas", classCode: "A2" },
  { id: "stu-028", name: "Jabari Okafor", classCode: "D1" },
  { id: "stu-029", name: "Imani Sarpong", classCode: "B3" },
  { id: "stu-030", name: "Tolu Adebayo", classCode: "C3" },
];

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
  const [contentUploadError, setContentUploadError] = useState("");
  const [uploads, setUploads] = useState([]);
  const [planId, setPlanId] = useState("free");
  const [feedbackMode, setFeedbackMode] = useState("broadcast");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackQuery, setFeedbackQuery] = useState("");
  const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [showAllFeedbackRecipients, setShowAllFeedbackRecipients] = useState(false);

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
    if (!storedPlan) return;
    if (storedPlan === "upgraded") {
      setPlanId("pro-5gb");
      return;
    }
    if (STORAGE_PLANS.some((plan) => plan.id === storedPlan)) {
      setPlanId(storedPlan);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads));
  }, [uploads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PLAN_KEY, planId);
  }, [planId]);

  useEffect(() => {
    setFeedbackStatus("");
  }, [feedbackMode, feedbackMessage, selectedRecipientIds, feedbackQuery]);

  useEffect(() => {
    setShowAllFeedbackRecipients(false);
  }, [feedbackMode, selectedRecipientIds, feedbackQuery]);

  const currentPlan =
    STORAGE_PLANS.find((plan) => plan.id === planId) || STORAGE_PLANS[0];
  const storageLimitBytes = currentPlan.bytes;
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
        `Storage limit reached for ${currentPlan.label}. ${formatBytes(
          remainingBytes,
        )} free. Upgrade for more storage.`,
      );
      return;
    }

    setContentUploadError("");
    setSelectedFiles(files.map((file) => file.name));
    const nextUploads = files.map(buildUploadEntry);
    setUploads((prev) => [...nextUploads, ...prev]);
  };

  const normalizeMessage = (message, name) => {
    const trimmed = message.trim();
    if (!trimmed) {
      return `Hi ${name},`;
    }
    if (trimmed.includes("{name}")) {
      return trimmed.replaceAll("{name}", name);
    }
    return `Hi ${name}, ${trimmed}`;
  };

  const filteredRecipients = feedbackStudents.filter((student) => {
    if (!feedbackQuery.trim()) return true;
    const query = feedbackQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.classCode.toLowerCase().includes(query)
    );
  });

  const recipients =
    feedbackMode === "broadcast"
      ? feedbackStudents
      : feedbackStudents.filter((student) =>
          selectedRecipientIds.includes(student.id),
        );
  const previewRecipients = showAllFeedbackRecipients
    ? recipients
    : recipients.slice(0, 10);

  const handleRecipientToggle = (id) => {
    setSelectedRecipientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSendFeedback = () => {
    if (!feedbackMessage.trim()) {
      setFeedbackStatus("Write a message before sending.");
      return;
    }
    if (feedbackMode === "targeted" && recipients.length === 0) {
      setFeedbackStatus("Select at least one student.");
      return;
    }
    setFeedbackStatus(
      `Sent to ${recipients.length} student${
        recipients.length === 1 ? "" : "s"
      }.`,
    );
  };

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
            { label: "Students", href: "/students" },
            { label: "Progress Tracking", href: "/progTrack" },
            { label: "Assessments", href: "/assessments" },
            { label: "Live Sessions", href: "/live" },
            { label: "Attendance", href: "/attendance" },
            { label: "Content Hub", href: "/content" },
            { label: "Learner Insights", href: "/insights" },
            { label: "Subscriptions", href: "/subscriptions" },
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
            <p className="text-sm font-semibold">Storage-based subscription</p>
            <p className="mt-2 text-xs text-slate-200">
              Unlimited uploads. Choose Plus 5 GB (KES 500) or Pro 10 GB (KES
              1,000) when you need more space.
            </p>
            <p className="mt-2 text-xs font-semibold text-white">
              Current plan: {currentPlan.label} · {currentPlan.price}
            </p>
            <Link
              href="/subscriptions"
              className="mt-4 w-full rounded-2xl bg-white/15 py-2 text-center text-xs font-semibold uppercase tracking-wide"
            >
              Manage plan
            </Link>
          </div>
        </aside>

        <main className="flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white/80 px-6 py-4 shadow-[0_18px_50px_-35px_rgba(28,20,56,0.45)] backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                GoDomain Teacher
              </p>
              <h1 className="text-2xl font-semibold text-slate-900">
                Good evening, Coach Amani
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
              <Link
                href="/live"
                className="rounded-2xl bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white"
              >
                Live Session
              </Link>
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2">
                <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400" />
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-700">Amani Mwangi</p>
                  <p className="text-slate-400">Driving Instructor</p>
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
                    <Link
                      href="/insights"
                      className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white"
                    >
                      View learner insights
                    </Link>
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
                    Send feedback
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 ${
                        feedbackMode === "broadcast"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                      onClick={() => setFeedbackMode("broadcast")}
                    >
                      Broadcast message
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-3 py-1 ${
                        feedbackMode === "targeted"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                      onClick={() => setFeedbackMode("targeted")}
                    >
                      Targeted message
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Message
                    </p>
                    <textarea
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-200"
                      rows={3}
                      placeholder="Type a message. Use {name} to insert the student name."
                      value={feedbackMessage}
                      onChange={(event) => setFeedbackMessage(event.target.value)}
                    />
                  </div>

                  {feedbackMode === "broadcast" ? (
                    <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                      Broadcasting to all {feedbackStudents.length} students.
                    </div>
                  ) : (
                    <div className="mt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Select students
                      </p>
                      <input
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-200"
                        placeholder="Search by name or class"
                        value={feedbackQuery}
                        onChange={(event) => setFeedbackQuery(event.target.value)}
                      />
                      <div className="mt-2 max-h-32 space-y-2 overflow-auto">
                        {filteredRecipients.length === 0 ? (
                          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                            No students found.
                          </div>
                        ) : (
                          filteredRecipients.map((student) => (
                            <label
                              key={student.id}
                              className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-indigo-500"
                                  checked={selectedRecipientIds.includes(
                                    student.id,
                                  )}
                                  onChange={() => handleRecipientToggle(student.id)}
                                />
                                <div>
                                  <p className="text-sm font-semibold text-slate-700">
                                    {student.name}
                                  </p>
                                  <p className="text-[11px] text-slate-400">
                                    Class {student.classCode}
                                  </p>
                                </div>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        Selected {selectedRecipientIds.length} of{" "}
                        {feedbackStudents.length}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <button
                      className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                      onClick={handleSendFeedback}
                      disabled={
                        !feedbackMessage.trim() ||
                        (feedbackMode === "targeted" &&
                          selectedRecipientIds.length === 0)
                      }
                    >
                      Send message
                    </button>
                    {feedbackStatus ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        {feedbackStatus}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Personalized preview
                    </p>
                    <div className="mt-2 max-h-40 space-y-2 overflow-auto">
                      {recipients.length === 0 ? (
                        <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                          No recipients selected.
                        </div>
                      ) : (
                        previewRecipients.map((student) => (
                          <div
                            key={student.id}
                            className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600"
                          >
                            <p className="text-xs font-semibold text-slate-700">
                              To {student.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {normalizeMessage(feedbackMessage, student.name)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {recipients.length > 10 ? (
                      <button
                        className="mt-2 text-xs font-semibold text-indigo-600"
                        type="button"
                        onClick={() =>
                          setShowAllFeedbackRecipients((prev) => !prev)
                        }
                      >
                        {showAllFeedbackRecipients
                          ? "Show fewer"
                          : `Show all ${recipients.length}`}
                      </button>
                    ) : null}
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
    </div>
  );
}


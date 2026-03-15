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
const STUDENT_STORAGE_KEY = "goTeachCustomStudents";
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

const libraryCards = [
  {
    title: "Recorded Classes",
    action: "Manage videos",
    color: "from-indigo-500 to-violet-500",
    kind: "recorded",
  },
  {
    title: "Notes and Handouts",
    action: "Organize notes",
    color: "from-emerald-400 to-teal-500",
    kind: "notes",
  },
  {
    title: "Images and Diagrams",
    action: "Browse gallery",
    color: "from-rose-400 to-orange-400",
    kind: "images",
  },
  {
    title: "External Links",
    action: "Edit links",
    color: "from-slate-700 to-slate-900",
  },
];

const seedStudents = [
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

const isSameLocalDay = (leftDate, rightDate) =>
  leftDate.getFullYear() === rightDate.getFullYear() &&
  leftDate.getMonth() === rightDate.getMonth() &&
  leftDate.getDate() === rightDate.getDate();

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

export default function ContentDashboardPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState([]);
  const [planId, setPlanId] = useState("free");
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [customStudentName, setCustomStudentName] = useState("");
  const [customStudents, setCustomStudents] = useState([]);
  const [selectedResourceIds, setSelectedResourceIds] = useState([]);
  const [shareStatus, setShareStatus] = useState("");

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
    const storedStudents = localStorage.getItem(STUDENT_STORAGE_KEY);
    if (!storedStudents) return;
    try {
      const parsed = JSON.parse(storedStudents);
      if (Array.isArray(parsed)) {
        setCustomStudents(parsed);
      }
    } catch {
      setCustomStudents([]);
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
    localStorage.setItem(
      STUDENT_STORAGE_KEY,
      JSON.stringify(customStudents),
    );
  }, [customStudents]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_PLAN_KEY,
      planId,
    );
  }, [planId]);

  useEffect(() => {
    setSelectedResourceIds((prev) =>
      prev.filter((id) => uploads.some((item) => item.id === id)),
    );
  }, [uploads]);

  useEffect(() => {
    setShareStatus("");
  }, [selectedStudentIds, selectedResourceIds]);

  const currentPlan =
    STORAGE_PLANS.find((plan) => plan.id === planId) || STORAGE_PLANS[0];
  const storageLimitBytes = currentPlan.bytes;
  const usedBytes = uploads.reduce(
    (total, item) => total + (item.sizeBytes || 0),
    0,
  );
  const remainingBytes = Math.max(0, storageLimitBytes - usedBytes);
  const overLimitBytes = Math.max(0, usedBytes - storageLimitBytes);
  const usedPercent =
    storageLimitBytes > 0
      ? Math.min(100, Math.round((usedBytes / storageLimitBytes) * 100))
      : 0;

  const handleUploadChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const incomingBytes = files.reduce((total, file) => total + file.size, 0);
    if (usedBytes + incomingBytes > storageLimitBytes) {
      setUploadError(
        `Storage limit reached for ${currentPlan.label}. ${formatBytes(
          remainingBytes,
        )} free. Upgrade for more storage.`,
      );
      return;
    }

    setUploadError("");
    setSelectedFiles(files.map((file) => file.name));
    const nextUploads = files.map(buildUploadEntry);
    setUploads((prev) => [...nextUploads, ...prev]);
  };

  const toggleSelection = (id) => {
    setSelectedForRemoval((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleRemoveSelected = () => {
    if (selectedForRemoval.length === 0) return;
    setUploads((prev) =>
      prev.filter((item) => !selectedForRemoval.includes(item.id)),
    );
    setSelectedForRemoval([]);
  };

  const handleClearAll = () => {
    setUploads([]);
    setSelectedForRemoval([]);
  };

  const handlePlanChange = (nextPlanId) => {
    setPlanId(nextPlanId);
    setUploadError("");
  };

  const allStudents = [...seedStudents, ...customStudents];
  const filteredStudents = allStudents.filter((student) => {
    if (!studentQuery.trim()) return true;
    const query = studentQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.classCode.toLowerCase().includes(query)
    );
  });

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleResourceSelection = (id) => {
    setSelectedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAddCustomStudent = () => {
    const trimmed = customStudentName.trim();
    if (!trimmed) return;
    const newStudent = {
      id: generateId(),
      name: trimmed,
      classCode: "External",
    };
    setCustomStudents((prev) => [newStudent, ...prev]);
    setSelectedStudentIds((prev) => [newStudent.id, ...prev]);
    setCustomStudentName("");
  };

  const handleShareResources = () => {
    if (selectedStudentIds.length === 0 || selectedResourceIds.length === 0) {
      setShareStatus("Select at least one student and one resource.");
      return;
    }
    const status = `Shared ${selectedResourceIds.length} resource${
      selectedResourceIds.length === 1 ? "" : "s"
    } to ${selectedStudentIds.length} student${
      selectedStudentIds.length === 1 ? "" : "s"
    }.`;
    setShareStatus(status);
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
  const today = new Date();
  const sharedTodayCount = uploads.filter((item) => {
    if (!item.uploadedAt) return false;
    const date = new Date(item.uploadedAt);
    if (Number.isNaN(date.getTime())) return false;
    return isSameLocalDay(date, today);
  }).length;
  const pendingReviewCount = uploads.filter((item) => item.needsReview).length;
  const metrics = [
    {
      label: "Content items",
      value: String(uploads.length),
      tone: "bg-indigo-500/10",
    },
    {
      label: "Shared today",
      value: String(sharedTodayCount),
      tone: "bg-emerald-500/10",
    },
    {
      label: "Storage used",
      value: formatBytes(usedBytes),
      tone: "bg-amber-500/10",
    },
    {
      label: "Pending review",
      value: String(pendingReviewCount),
      tone: "bg-rose-500/10",
    },
  ];

  return (
    <div
      className={`${dmSans.className} ${spaceGrotesk.variable} min-h-screen w-full bg-[radial-gradient(circle_at_top,_#f3ecff_0%,_#f8f4ff_35%,_#fff6ee_70%,_#ffffff_100%)] text-slate-900`}
    >
      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 px-6 py-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white/85 px-6 py-5 shadow-[0_18px_50px_-35px_rgba(28,20,56,0.45)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Teacher content dashboard
            </p>
            <h1
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Curate and share learning resources
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-slate-500"
            >
              Back to home
            </Link>
            <Link
              href="/progTrack"
              className="rounded-full bg-slate-900 px-4 py-2 text-white"
            >
              Progress tracking
            </Link>
          </div>
        </header>

        <section className="grid gap-4 responsive-cols">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[24px] bg-white/90 p-4 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]"
            >
              <div className={`h-10 w-10 rounded-2xl ${metric.tone}`} />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {metric.label}
              </p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {metric.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 responsive-cols">
              {libraryCards.map((card) => {
                const detail = (() => {
                  if (card.kind === "recorded") {
                    return `${recordedCount} ${
                      recordedCount === 1 ? "video" : "videos"
                    } - ${formatBytes(recordedSize)} stored`;
                  }
                  if (card.kind === "images") {
                    return `${imageCount} ${
                      imageCount === 1 ? "visual" : "visuals"
                    } - ${formatBytes(imageSize)} stored`;
                  }
                  if (card.kind === "notes") {
                    return `${notesCount} ${
                      notesCount === 1 ? "file" : "files"
                    } - ${formatBytes(notesSize)} stored`;
                  }
                  return card.detail;
                })();

                return (
                  <div
                    key={card.title}
                    className="rounded-[26px] bg-white/90 p-5 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]"
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color}`}
                    />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {card.title}
                    </h3>
                    {detail ? (
                      <p className="mt-1 text-xs text-slate-500">{detail}</p>
                    ) : (
                      <div className="mt-4" />
                    )}
                    <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                      {card.action}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="rounded-[30px] bg-white/90 p-6 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    Sharing activity
                  </p>
                  <h2
                    className="text-xl font-semibold text-slate-900"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Latest uploads and shares
                  </h2>
                </div>
                <label
                  htmlFor="content-upload"
                  className="cursor-pointer rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Upload new
                  <input
                    id="content-upload"
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
              {uploadError && (
                <p className="mt-2 text-xs font-semibold text-rose-500">
                  {uploadError}
                </p>
              )}
              <div className="mt-5 space-y-3">
                {uploads.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-4 text-xs text-slate-500">
                    No uploads yet. Add a video or resource to see it here.
                  </div>
                ) : (
                  uploads.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.type} - {item.size}
                        </p>
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[28px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 p-6 text-white shadow-[0_25px_70px_-40px_rgba(90,60,160,0.75)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
                Quick share
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                Send resources to targeted students
              </h3>
              <p className="mt-2 text-xs text-indigo-100">
                Choose students (or add external) and share uploaded content.
              </p>
              <div className="mt-4 space-y-3 rounded-2xl bg-white/10 p-4 text-xs text-indigo-100">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-100/80">
                    Find students
                  </p>
                  <input
                    value={studentQuery}
                    onChange={(event) => setStudentQuery(event.target.value)}
                    placeholder="Search by name or class code"
                    className="mt-2 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-indigo-200/70"
                  />
                </div>
                <div className="max-h-32 space-y-2 overflow-auto pr-1">
                  {filteredStudents.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                      No matching students.
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-white"
                            checked={selectedStudentIds.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-indigo-100/80">
                              {student.classCode}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={customStudentName}
                    onChange={(event) => setCustomStudentName(event.target.value)}
                    placeholder="Add external student"
                    className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder:text-indigo-200/70"
                  />
                  <button
                    onClick={handleAddCustomStudent}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-indigo-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 p-4 text-xs text-indigo-100">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-indigo-100/80">
                  Resources to share
                </p>
                <div className="mt-2 max-h-28 space-y-2 overflow-auto pr-1">
                  {uploads.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-2">
                      Upload content to share it here.
                    </div>
                  ) : (
                    uploads.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/10 px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-white"
                            checked={selectedResourceIds.includes(item.id)}
                            onChange={() => toggleResourceSelection(item.id)}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-indigo-100/80">
                              {item.type} · {item.size}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <button
                className="mt-4 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-700 disabled:opacity-70"
                onClick={handleShareResources}
                disabled={
                  selectedStudentIds.length === 0 ||
                  selectedResourceIds.length === 0
                }
              >
                Share selected
              </button>
              {shareStatus && (
                <p className="mt-2 text-xs font-semibold text-white">
                  {shareStatus}
                </p>
              )}
            </div>

            <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Collections
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">
                Class resource sets
              </h3>
              <div className="mt-4 space-y-3 text-xs text-slate-600">
                {[
                  "Exam review pack",
                  "Practical lab checklist",
                  "STEM project starter kit",
                ].map((collection) => (
                  <div
                    key={collection}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                  >
                    <span>{collection}</span>
                    <button className="text-xs font-semibold text-indigo-600">
                      Share
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-900 p-6 text-white shadow-[0_25px_70px_-40px_rgba(10,10,20,0.8)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Storage health
              </p>
              <h3 className="mt-2 text-lg font-semibold">
                {usedPercent}% used
              </h3>
              <div className="mt-3 h-2 rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
                  style={{ width: `${usedPercent}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-slate-300">
                Unused storage: {formatBytes(remainingBytes)} of{" "}
                {formatBytes(storageLimitBytes)}.
              </p>
              {overLimitBytes > 0 ? (
                <p className="mt-2 text-xs font-semibold text-rose-300">
                  Over limit by {formatBytes(overLimitBytes)}. Upgrade to 5 GB
                  or 10 GB for more storage.
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-300">
                  Archive older videos to free space for new sessions.
                </p>
              )}
              <button
                className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white"
                onClick={() => setIsManageOpen(true)}
              >
                Manage storage
              </button>
            </div>
          </aside>
        </section>
      </div>
      {isManageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
          <div className="w-full max-w-xl rounded-[28px] bg-white p-6 shadow-[0_30px_90px_-60px_rgba(20,20,40,0.8)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  Manage storage
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">
                  {currentPlan.label} plan · {formatBytes(storageLimitBytes)}{" "}
                  total
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {currentPlan.detail} · {currentPlan.price}
                </p>
              </div>
              <button
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500"
                onClick={() => setIsManageOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  Used {formatBytes(usedBytes)} · Remaining{" "}
                  {formatBytes(remainingBytes)}
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                  Unlimited uploads
                </span>
              </div>
              {overLimitBytes > 0 && (
                <p className="mt-2 text-xs font-semibold text-rose-500">
                  You are over by {formatBytes(overLimitBytes)}. Upgrade to a
                  larger pack or remove files.
                </p>
              )}
            </div>

            <div className="mt-4 grid gap-3 responsive-cols">
              {STORAGE_PLANS.map((plan) => {
                const isCurrent = plan.id === planId;
                return (
                  <button
                    key={plan.id}
                    className={`rounded-2xl border px-3 py-3 text-left text-xs transition ${
                      isCurrent
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                    }`}
                    onClick={() => handlePlanChange(plan.id)}
                    type="button"
                  >
                    <p className="text-sm font-semibold">{plan.label}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {plan.detail}
                    </p>
                    <p className="mt-1 text-[11px] font-semibold text-slate-700">
                      {plan.price}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        isCurrent
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {isCurrent ? "Current" : "Select"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Stored content
              </p>
              <div className="mt-3 max-h-64 space-y-2 overflow-auto pr-2 text-xs text-slate-600">
                {uploads.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">
                    No content uploaded yet.
                  </div>
                ) : (
                  uploads.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-indigo-500"
                          checked={selectedForRemoval.includes(item.id)}
                          onChange={() => toggleSelection(item.id)}
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.type} · {item.size}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {item.time}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
                onClick={handleRemoveSelected}
                disabled={selectedForRemoval.length === 0}
              >
                Remove selected
              </button>
              <button
                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600"
                onClick={handleClearAll}
                disabled={uploads.length === 0}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

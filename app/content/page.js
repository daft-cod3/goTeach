import Link from "next/link";
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

const libraryCards = [
  {
    title: "Recorded Classes",
    detail: "18 videos - 6.4 GB stored",
    action: "Manage videos",
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "Notes and Handouts",
    detail: "42 files - updated 2 hours ago",
    action: "Organize notes",
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "Images and Diagrams",
    detail: "312 visuals - tagged by topic",
    action: "Browse gallery",
    color: "from-rose-400 to-orange-400",
  },
  {
    title: "External Links",
    detail: "27 references - curated weekly",
    action: "Edit links",
    color: "from-slate-700 to-slate-900",
  },
];

const recentUploads = [
  {
    title: "Cell Division Walkthrough",
    type: "Video",
    size: "820 MB",
    time: "Uploaded 40 mins ago",
  },
  {
    title: "Genetics Worksheet Pack",
    type: "PDF",
    size: "12 MB",
    time: "Uploaded yesterday",
  },
  {
    title: "Lab Safety Infographic",
    type: "Image",
    size: "4 MB",
    time: "Uploaded 2 days ago",
  },
];

export default function ContentDashboardPage() {
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

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Content items", value: "486", tone: "bg-indigo-500/10" },
            { label: "Shared today", value: "12", tone: "bg-emerald-500/10" },
            { label: "Storage used", value: "14.8 GB", tone: "bg-amber-500/10" },
            { label: "Pending review", value: "5", tone: "bg-rose-500/10" },
          ].map((metric) => (
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
            <div className="grid gap-4 md:grid-cols-2">
              {libraryCards.map((card) => (
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
                  <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
                  <button className="mt-4 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                    {card.action}
                  </button>
                </div>
              ))}
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
                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                  Upload new
                </button>
              </div>
              <div className="mt-5 space-y-3">
                {recentUploads.map((item) => (
                  <div
                    key={item.title}
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
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-[28px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 p-6 text-white shadow-[0_25px_70px_-40px_rgba(90,60,160,0.75)]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-100">
                Quick share
              </p>
              <h3 className="mt-3 text-lg font-semibold">
                Send resources to selected students
              </h3>
              <p className="mt-2 text-xs text-indigo-100">
                Drop a link, attach a file, or share a video instantly.
              </p>
              <button className="mt-5 w-full rounded-full bg-white px-4 py-2 text-xs font-semibold text-indigo-700">
                Create share bundle
              </button>
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
              <h3 className="mt-2 text-lg font-semibold">82% used</h3>
              <div className="mt-3 h-2 rounded-full bg-white/15">
                <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
              </div>
              <p className="mt-3 text-xs text-slate-300">
                Archive older videos to free space for new sessions.
              </p>
              <button className="mt-4 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white">
                Manage storage
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

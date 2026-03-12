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

export default function Home() {
  return (
    <div
      className={`${dmSans.className} ${spaceGrotesk.variable} min-h-screen bg-[radial-gradient(circle_at_top,_#f2ecff_0%,_#f7f2ff_35%,_#fef8f3_70%,_#ffffff_100%)] text-slate-900`}
    >
      <div className="relative mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-8 lg:px-8">
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
              "Dashboard",
              "Students",
              "Learning Paths",
              "Assessments",
              "Live Sessions",
              "Attendance",
              "Content Hub",
              "Reports",
            ].map((item, index) => (
              <button
                key={item}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 transition ${
                  index === 0
                    ? "bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400 text-white shadow-md"
                    : "hover:bg-white/60"
                }`}
              >
                <span>{item}</span>
                {index === 0 ? (
                  <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] uppercase tracking-wide">
                    Live
                  </span>
                ) : null}
              </button>
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
                Good evening, Ms. Diala
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
              <button className="rounded-2xl bg-emerald-500/90 px-4 py-2 text-xs font-semibold text-white">
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
                    Teacher Dashboard
                  </p>
                  <h2
                    className="mt-3 text-3xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    Keep every learner on pace and energized.
                  </h2>
                  <p className="mt-3 text-sm text-indigo-100">
                    Track quiz performance, monitor learning plans, and share
                    content all from one calm, beautiful workspace.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-full bg-white px-5 py-2 text-xs font-semibold text-indigo-700">
                      Create quick quiz
                    </button>
                    <button className="rounded-full border border-white/40 px-5 py-2 text-xs font-semibold text-white">
                      View class insights
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
                        Student quiz performance
                      </h3>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      +12% this week
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
                    <span>Avg. score 83%</span>
                    <span>142 quizzes graded</span>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                        Progress tracking
                      </p>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Planned learning monitor
                      </h3>
                    </div>
                    <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                      18 plans active
                    </span>
                  </div>
                  <div className="mt-5 space-y-4">
                    {[
                      {
                        label: "Cell biology module",
                        value: 72,
                        color: "from-emerald-400 to-teal-500",
                      },
                      {
                        label: "Genetics lab week",
                        value: 58,
                        color: "from-indigo-400 to-violet-500",
                      },
                      {
                        label: "Exam review sprints",
                        value: 84,
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
                    <span>On-track: 76%</span>
                    <span>Needs focus: 14%</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[30px] bg-white/90 p-6 shadow-[0_20px_55px_-45px_rgba(30,22,70,0.5)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                      Teacher content dashboard
                    </p>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Share lessons, media, and resources
                    </h3>
                  </div>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
                    Upload new content
                  </button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Recorded Classes",
                      description: "18 videos · 6.4 GB",
                      color: "from-indigo-500 to-violet-500",
                    },
                    {
                      title: "Notes & Handouts",
                      description: "42 files · updated 2h ago",
                      color: "from-emerald-400 to-teal-500",
                    },
                    {
                      title: "Images & Diagrams",
                      description: "312 visuals · tagged",
                      color: "from-rose-400 to-orange-400",
                    },
                    {
                      title: "Helpful Links",
                      description: "27 references · curated",
                      color: "from-slate-600 to-slate-800",
                    },
                  ].map((item) => (
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
                      <p className="mt-1 text-xs text-slate-500">
                        {item.description}
                      </p>
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
                      Direct messages
                    </h3>
                  </div>
                  <button className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600">
                    New
                  </button>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    { name: "K. Onyango", note: "Needs help with Chapter 4" },
                    { name: "S. Patel", note: "Submitted early quiz" },
                    { name: "L. Novak", note: "Requested a recap" },
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
                      placeholder="Type a note to selected students"
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
                      Class engagement
                    </h3>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-600">
                    89% active
                  </span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    { label: "Live attendance", value: "24/27" },
                    { label: "Quiz completion", value: "93%" },
                    { label: "Forum questions", value: "18 today" },
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
                  Next class
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  Genetics Lab Live
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  Thursday - 3:30 PM - Virtual Room B
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

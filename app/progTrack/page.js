import Link from "next/link";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import StudCard from "../components/studCard";

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

const students = [
  {
    id: "gd-001",
    name: "Abena Kofi",
    indexNumber: "GD1021",
    driverClass: "B1",
    gender: "Female",
    quizPerformance: "good",
    learningStreak: "strong",
  },
  {
    id: "gd-002",
    name: "Musa Diallo",
    indexNumber: "GD1044",
    driverClass: "A2",
    gender: "Male",
    quizPerformance: "average",
    learningStreak: "steady",
  },
  {
    id: "gd-003",
    name: "Lara Juma",
    indexNumber: "GD1099",
    driverClass: "C1",
    gender: "Female",
    quizPerformance: "low",
    learningStreak: "low",
  },
  {
    id: "gd-004",
    name: "Hassan Okoye",
    indexNumber: "GD1108",
    driverClass: "D2",
    gender: "Male",
    quizPerformance: "good",
    learningStreak: "steady",
  },
];

export default function ProgressTrackingPage() {
  return (
    <div
      className={`${dmSans.className} ${spaceGrotesk.variable} min-h-screen w-full bg-[radial-gradient(circle_at_top,_#f2ecff_0%,_#f8f3ff_35%,_#fff6ef_70%,_#ffffff_100%)] text-slate-900`}
    >
      <div className="mx-auto flex min-h-screen w-full flex-col gap-6 px-6 py-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white/85 px-6 py-5 shadow-[0_18px_50px_-35px_rgba(28,20,56,0.45)] backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Progress tracking
            </p>
            <h1
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Student performance dashboard
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
              href="/content"
              className="rounded-full bg-slate-900 px-4 py-2 text-white"
            >
              Content hub
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Average quiz score",
              value: "83%",
              detail: "+12% this month",
              color: "from-emerald-400 to-teal-500",
            },
            {
              label: "Students on track",
              value: "76%",
              detail: "18 learning plans active",
              color: "from-indigo-400 to-violet-500",
            },
            {
              label: "Active streaks",
              value: "42",
              detail: "7 students need attention",
              color: "from-rose-400 to-orange-400",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[26px] bg-white/90 p-5 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]"
            >
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${card.color}`}
              />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{card.detail}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] bg-white/85 px-6 py-5 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.5)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Learning plans
            </p>
            <h2
              className="text-xl font-semibold text-slate-900"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Monitor student streak intensity
            </h2>
          </div>
          <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600">
            Export report
          </button>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {students.map((student) => (
            <StudCard key={student.id} {...student} />
          ))}
        </section>
      </div>
    </div>
  );
}

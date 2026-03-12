export default function StudCard({
  id,
  name,
  indexNumber,
  driverClass,
  gender,
  quizPerformance = "average",
  learningStreak = "steady",
}) {
  const quizOptions = [
    { label: "Low", value: "low", accent: "accent-rose-500" },
    { label: "Average", value: "average", accent: "accent-amber-400" },
    { label: "Good", value: "good", accent: "accent-emerald-500" },
  ];

  const streakOptions = [
    { label: "Low", value: "low", accent: "accent-slate-400" },
    { label: "Steady", value: "steady", accent: "accent-indigo-500" },
    { label: "Strong", value: "strong", accent: "accent-emerald-500" },
  ];

  return (
    <article className="group rounded-[26px] border border-white/60 bg-white/85 p-5 shadow-[0_18px_55px_-45px_rgba(30,22,70,0.6)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_-50px_rgba(30,22,70,0.65)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Student
          </p>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="text-xs text-slate-500">Index No. {indexNumber}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 px-3 py-2 text-xs font-semibold text-white shadow-md">
          {driverClass}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-500">
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Gender
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{gender}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            Class Code
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {driverClass}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-white/70 px-4 py-4">
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quiz performance
          </legend>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            {quizOptions.map((option) => (
              <label
                key={`${id}-quiz-${option.value}`}
                className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5"
              >
                <input
                  type="radio"
                  name={`${id}-quiz`}
                  value={option.value}
                  defaultChecked={quizPerformance === option.value}
                  className={`h-3.5 w-3.5 ${option.accent}`}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-4 space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Monitor learning streak
          </legend>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600">
            {streakOptions.map((option) => (
              <label
                key={`${id}-streak-${option.value}`}
                className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5"
              >
                <input
                  type="radio"
                  name={`${id}-streak`}
                  value={option.value}
                  defaultChecked={learningStreak === option.value}
                  className={`h-3.5 w-3.5 ${option.accent}`}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </article>
  );
}

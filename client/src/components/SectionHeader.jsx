export default function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-zinc-200 pb-5 dark:border-zinc-800 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-zinc-950 dark:text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}

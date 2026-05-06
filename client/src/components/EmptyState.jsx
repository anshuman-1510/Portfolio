export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center dark:border-zinc-700 dark:bg-zinc-900/70">
      <p className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}

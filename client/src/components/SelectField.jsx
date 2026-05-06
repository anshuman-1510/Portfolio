export default function SelectField({ label, id, children, className = "", ...props }) {
  return (
    <label className={`block ${className}`} htmlFor={id}>
      <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </span>
      <select
        id={id}
        className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

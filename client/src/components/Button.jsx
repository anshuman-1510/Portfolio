export default function Button({
  children,
  className = "",
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400",
    secondary:
      "border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
    ghost:
      "text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-400 dark:text-zinc-200 dark:hover:bg-zinc-800",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 dark:bg-rose-500 dark:hover:bg-rose-400"
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    icon: "h-10 w-10 p-0"
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

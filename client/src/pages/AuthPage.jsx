import { ArrowRight, Loader2, Lock, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import InputField from "../components/InputField.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    username: "",
    email: "",
    identifier: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user, signup, login, loading } = useAuth();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup({
          username: form.username,
          email: form.email,
          password: form.password
        });
      } else {
        await login({
          identifier: form.identifier,
          password: form.password
        });
      }
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to authenticate");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="animate-rise">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="text-lg font-black tracking-tight">
              Portfolio Builder
            </Link>
            <ThemeToggle />
          </div>
          <div className="max-w-xl">
            <p className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              Full-stack portfolio studio
            </p>
            <h1 className="text-5xl font-black leading-tight sm:text-6xl">
              Build, edit, and publish a portfolio at your own URL.
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Manage profile content, projects, skills, experience, and contact links from one responsive dashboard.
            </p>
          </div>
        </section>

        <section className="animate-rise rounded-lg border border-zinc-200 bg-white p-6 shadow-soft dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <div className="mb-6 grid grid-cols-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              className={`h-10 rounded-md text-sm font-bold transition ${
                isSignup
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              type="button"
              onClick={() => setMode("signup")}
            >
              Sign up
            </button>
            <button
              className={`h-10 rounded-md text-sm font-bold transition ${
                !isSignup
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-950 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              type="button"
              onClick={() => setMode("login")}
            >
              Login
            </button>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              {isSignup ? <UserPlus size={21} /> : <Lock size={21} />}
            </div>
            <div>
              <h2 className="text-2xl font-black">{isSignup ? "Create account" : "Welcome back"}</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isSignup ? "Your public page will live at /username." : "Continue editing your portfolio."}
              </p>
            </div>
          </div>

          {error ? (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {error}
            </div>
          ) : null}

          <form className="grid gap-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <>
                <InputField
                  id="username"
                  label="Username"
                  name="username"
                  placeholder="anshuman"
                  value={form.username}
                  onChange={updateField}
                  required
                  minLength={3}
                />
                <InputField
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </>
            ) : (
              <InputField
                id="identifier"
                label="Email or username"
                name="identifier"
                placeholder="you@example.com"
                value={form.identifier}
                onChange={updateField}
                required
              />
            )}
            <InputField
              id="password"
              label="Password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={updateField}
              required
              minLength={8}
            />
            <Button type="submit" className="mt-2 w-full" disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isSignup ? "Create portfolio" : "Login"}
              <ArrowRight size={18} />
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PortfolioRenderer from "../components/PortfolioRenderer.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import api from "../services/api.js";

export default function PublicPortfolioPage() {
  const { username } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadPublicPortfolio() {
      try {
        const { data } = await api.get(`/portfolio/public/${username}`);
        if (!ignore) {
          setPayload(data);
        }
      } catch {
        if (!ignore) {
          setNotFound(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPublicPortfolio();

    return () => {
      ignore = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  if (notFound || !payload) {
    return (
      <main className="grid min-h-screen place-items-center bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-white">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        <section className="max-w-md rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
            404
          </p>
          <h1 className="mt-3 text-3xl font-black">Portfolio not found</h1>
          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            This public portfolio does not exist yet.
          </p>
          <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700" to="/">
            Build one
          </Link>
        </section>
      </main>
    );
  }

  return <PortfolioRenderer portfolio={payload.portfolio} user={payload.user} />;
}

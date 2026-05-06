import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import PortfolioRenderer from "../components/PortfolioRenderer.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api.js";

export default function PreviewPage() {
  const { user, portfolio, setPortfolio } = useAuth();
  const [currentPortfolio, setCurrentPortfolio] = useState(portfolio);
  const [loading, setLoading] = useState(!portfolio);

  useEffect(() => {
    let ignore = false;

    async function loadPortfolio() {
      if (portfolio) {
        return;
      }

      try {
        const { data } = await api.get("/portfolio/me");
        if (!ignore) {
          setCurrentPortfolio(data);
          setPortfolio(data);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      ignore = true;
    };
  }, [portfolio, setPortfolio]);

  if (loading || !currentPortfolio) {
    return (
      <div className="grid min-h-screen place-items-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link to="/dashboard">
            <Button variant="secondary">
              <ArrowLeft size={17} />
              Dashboard
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <PortfolioRenderer portfolio={currentPortfolio} user={user} />
    </div>
  );
}

import { Moon, Sun } from "lucide-react";
import Button from "./Button.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <Button
      aria-label="Toggle theme"
      title="Toggle theme"
      size="icon"
      variant="secondary"
      onClick={toggleTheme}
    >
      <Icon size={18} />
    </Button>
  );
}

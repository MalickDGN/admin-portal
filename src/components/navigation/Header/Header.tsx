import { Link, useLocation } from "react-router-dom";
import { Bell, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/theme/ThemeProvider";
import { useAuth } from "@services/auth/AuthProvider";
import { Tooltip } from "@ui/Tooltip/Tooltip";
import "./Header.css";

export function Header() {
  const { mode, toggleMode } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <header className="app-header">
      <nav className="app-header__breadcrumbs" aria-label="Breadcrumb">
        <Link to="/dashboard">Accueil</Link>
        {segments.map((seg, i) => (
          <span key={i}>
            {" "}/{" "}
            <Link to={"/" + segments.slice(0, i + 1).join("/")}>{decodeURIComponent(seg)}</Link>
          </span>
        ))}
      </nav>

      <div className="app-header__search">
        <Search size={16} />
        <input type="search" placeholder="Rechercher..." aria-label="Recherche globale" />
      </div>

      <div className="app-header__actions">
        <Tooltip content={mode === "dark" ? "Passer en clair" : "Passer en sombre"}>
          <button type="button" className="app-header__icon-btn" onClick={toggleMode} aria-label="Basculer le thème">
            {mode === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </Tooltip>
        <Tooltip content="Notifications">
          <button type="button" className="app-header__icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
        </Tooltip>
        {user && (
          <div className="app-header__user">
            <span className="app-header__avatar">{user.name.charAt(0)}</span>
            <span className="app-header__user-name">{user.name}</span>
          </div>
        )}
      </div>
    </header>
  );
}

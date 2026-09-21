import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";
import { navConfig } from "../nav-config";
import { useAuth } from "@services/auth/AuthProvider";
import "./Sidebar.css";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { hasRole } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const items = navConfig.filter((item) => !item.roles || hasRole(item.roles));

  return (
    <aside className={clsx("sidebar", collapsed && "sidebar--collapsed")}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">A</span>
        {!collapsed && <span className="sidebar__brand-name">Adaa Admin</span>}
      </div>

      <nav className="sidebar__nav">
        {items.map((item) => {
          const Icon = item.icon;
          const isGroup = Boolean(item.children?.length);
          const isOpen = openGroup === item.label;
          return (
            <div key={item.label} className="sidebar__group">
              {isGroup ? (
                <button
                  type="button"
                  className="sidebar__link"
                  onClick={() => setOpenGroup(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                >
                  <Icon size={18} />
                  {!collapsed && (
                    <>
                      <span>{item.label}</span>
                      <ChevronDown size={14} className={clsx("sidebar__chevron", isOpen && "sidebar__chevron--open")} />
                    </>
                  )}
                </button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => clsx("sidebar__link", isActive && "sidebar__link--active")}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )}

              {isGroup && isOpen && !collapsed && (
                <div className="sidebar__submenu">
                  {item.children!.map((child) => (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) => clsx("sidebar__sublink", isActive && "sidebar__sublink--active")}
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button type="button" className="sidebar__collapse-btn" onClick={onToggle}>
        {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
        {!collapsed && <span>Réduire</span>}
      </button>
    </aside>
  );
}

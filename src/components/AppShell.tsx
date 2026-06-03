import { Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navigation = [
    { to: "/", label: "Characters" },
    { to: "/episodes", label: "Episodes" },
    { to: "/locations", label: "Locations" }
];

interface AppShellProps {
    children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="app-shell">
            <header className="site-header">
                <NavLink className="brand" to="/">
                    <span className="brand-mark">R&M</span>
                    <span>
                        Rick and Morty
                        <strong>Explorer</strong>
                    </span>
                </NavLink>

                <button
                    className="menu-button"
                    type="button"
                    aria-expanded={menuOpen}
                    aria-label={menuOpen ? "Fechar navegacao" : "Abrir navegacao"}
                    onClick={() => setMenuOpen((current) => !current)}
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <nav className={`site-nav ${menuOpen ? "open" : ""}`.trim()}>
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/"}
                            className={({ isActive }) => (isActive ? "active" : undefined)}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>

            <main>{children}</main>

            <footer className="site-footer">
                <p>Refatorado com React, TypeScript, Vite e consumo da Rick and Morty API.</p>
            </footer>
        </div>
    );
}

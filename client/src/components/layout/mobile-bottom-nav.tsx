
import React, { useState, useEffect, useMemo } from 'react';
// Assurez-vous que cette dépendance est bien installée et configurée.
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

// --- CSS for Themes ---
// Ce bloc <style> devrait être dans votre fichier CSS global (par exemple, index.css)
// pour une application React réelle.
const GlobalThemeStyles = () => (
  <style>{`
    :root.theme-light {
        --bg-primary: #ffffff;
        --bg-secondary: #f3f4f6;
        --text-primary: #1f2937;
        --text-secondary: #6b7280;
        --border-color: #e5e7eb;
        --accent-color: #3b82f6;
        --accent-text-color: #ffffff;
    }
    :root.theme-dark {
        --bg-primary: #1f2937;
        --bg-secondary: #374151;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --border-color: #4b5563;
        --accent-color: #60a5fa;
        --accent-text-color: #1f2937;
    }
    :root.theme-blue {
        --bg-primary: #1e3a8a;
        --bg-secondary: #1e40af;
        --text-primary: #ffffff;
        --text-secondary: #dbeafe;
        --border-color: #1d4ed8;
        --accent-color: #93c5fd;
        --accent-text-color: #1e3a8a;
    }

    /* Applying Theme Colors with CSS Variables */
    body {
        background-color: var(--bg-secondary);
        transition: background-color 0.3s ease;
    }
    .nav-bg { background-color: var(--bg-primary); }
    .nav-text-primary { color: var(--text-primary); }
    .nav-text-secondary { color: var(--text-secondary); }
    .nav-border { border-color: var(--border-color); }
    .nav-accent-text { color: var(--accent-color); }
    .nav-accent-bg { background-color: var(--accent-color); }
    .nav-accent-text-color { color: var(--accent-text-color); }
    .nav-hover-bg:hover { background-color: var(--bg-secondary); }
    .nav-active-bg { background-color: var(--bg-secondary); }
    .nav-bg, .nav-text-primary, .nav-text-secondary, .nav-border {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    }
  `}</style>
);

// --- DATA MOCK for Filters ---
const incidentsData = [
    { id: 1, type: 'Agression', color: '#F97316' },
    { id: 2, type: 'Vol', color: '#EF4444' },
    { id: 3, type: 'Vandalisme', color: '#EAB308' },
];

// --- SVG Icons Component ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);

// --- ICONS OBJECT ---
const ICONS = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    feed: "M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M4 4v5h5",
    navigation: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 0l6-3m-6 3l6 3m0 0l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 3v6m6-3v6",
    incidents: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    reports: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    light: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    dark: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    blue: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
    collapse: "M11 19l-7-7 7-7m8 14l-7-7 7-7",
    expand: "M13 5l7 7-7 7M5 5l7 7-7 7",
};

// --- Main Navigation Bar Component (MODIFIED) ---
export default function EnhancedNavBar() {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const [currentTheme, setCurrentTheme] = useState('theme-light');
    const [activeFilters, setActiveFilters] = useState(new Set());

    const incidentTypes = useMemo(() => [...new Set(incidentsData.map(inc => inc.type))], []);
    const themes = ['theme-light', 'theme-dark', 'theme-blue'];
    const themeIcons = { 'theme-light': ICONS.light, 'theme-dark': ICONS.dark, 'theme-blue': ICONS.blue };
    const { user } = useAuth();

    useEffect(() => {
        document.documentElement.className = '';
        document.documentElement.classList.add(currentTheme);
    }, [currentTheme]);

    const handleThemeChange = () => {
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setCurrentTheme(themes[nextIndex]);
    };

    const handleToggleFilter = (type) => {
        setActiveFilters(prevFilters => {
            const newFilters = new Set(prevFilters);
            if (newFilters.has(type)) newFilters.delete(type);
            else newFilters.add(type);
            return newFilters;
        });
    };

    const handleResetFilters = () => setActiveFilters(new Set());

    return (
        <>
            <GlobalThemeStyles />

            {/* Show Button Container */}
            <div className={`fixed bottom-8 left-4 z-50 transition-opacity duration-500 ${!isNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <button 
                    onClick={() => setIsNavVisible(true)}
                    className="p-3 rounded-xl nav-bg nav-text-secondary shadow-lg hover:nav-accent-text"
                    title="Afficher la navigation"
                >
                    <Icon path={ICONS.expand} className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation Bar */}
            <aside 
                className="fixed left-0 flex flex-col py-6 px-4 nav-bg shadow-2xl transition-all duration-500 ease-in-out z-40 rounded-r-2xl"
                style={{
                    width: '260px',
                    bottom: '2rem',
                    maxHeight: 'calc(100vh - 4rem)',
                    transform: isNavVisible ? 'translateX(0)' : 'translateX(-100%)',
                    opacity: isNavVisible ? 1 : 0,
                }}
            >
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-6 flex-shrink-0">
                    <a href="#" className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg nav-accent-bg nav-accent-text-color font-bold text-xl flex-shrink-0">
                            <span>W</span>
                        </div>
                        <span className="font-bold nav-text-primary truncate">{user?.firstName || user?.email || 'Utilisateur'}</span>
                    </a>
                    <button onClick={() => setIsNavVisible(false)} className="p-2 rounded-xl nav-text-secondary nav-hover-bg" title="Masquer la navigation">
                        <Icon path={ICONS.collapse} className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content (Scrollable) */}
                <div className="w-full flex-grow overflow-y-auto pr-2">
                    {/* Main Links (MODIFIED) */}
                    <nav className="w-full flex flex-col space-y-2">

                      {/* ✅ Liens de navigation (utilisent <Link>) */}
                      <Link
                        to="/"
                        onClick={() => setActiveLink('home')}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl ${
                          activeLink === 'home'
                            ? 'nav-active-bg nav-accent-text'
                            : 'nav-text-secondary nav-hover-bg'
                        }`}
                        title="Home"
                      >
                        <Icon path={ICONS.home} className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold">Home</span>
                      </Link>

                      <Link
                        to="/feed"
                        onClick={() => setActiveLink('feed')}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl ${
                          activeLink === 'feed'
                            ? 'nav-active-bg nav-accent-text'
                            : 'nav-text-secondary nav-hover-bg'
                        }`}
                        title="Feed"
                      >
                        <Icon path={ICONS.feed} className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold">Feed</span>
                      </Link>

                      {/* ✅ Boutons d'action (utilisent <a>) */}
                      {Object.entries({
                        navigation: ICONS.navigation,
                        incidents: ICONS.incidents,
                        reports: ICONS.reports,
                      }).map(([key, path]) => (
                        <a
                          key={key}
                          href="#"
                          onClick={() => setActiveLink(key)}
                          className={`w-full flex items-center gap-4 p-3 rounded-xl ${
                            activeLink === key
                              ? 'nav-active-bg nav-accent-text'
                              : 'nav-text-secondary nav-hover-bg'
                          }`}
                          title={key.charAt(0).toUpperCase() + key.slice(1)}
                        >
                          <Icon path={path} className="w-5 h-5 flex-shrink-0" />
                          <span className="font-semibold">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </span>
                        </a>
                      ))}

                      {/* Lien vers le profil */}
                      <Link
                        to="/profil"
                        onClick={() => setActiveLink('profile')}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl ${
                          activeLink === 'profile'
                            ? 'nav-active-bg nav-accent-text'
                            : 'nav-text-secondary nav-hover-bg'
                        }`}
                        title="My Profil"
                      >
                        <Icon path={ICONS.profile} className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold text-sm">My Profil</span>
                      </Link>
                    </nav>

                    {/* Incident Filters Section */}
                    <div className={`w-full mt-4 pt-4 border-t nav-border transition-all duration-300 ease-in-out overflow-hidden ${activeLink === 'incidents' ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <h3 className="px-1 text-sm font-semibold nav-text-secondary mb-2">Filtres</h3>
                        <div className="flex flex-col space-y-2">
                            {incidentTypes.map(type => {
                                const isActive = activeFilters.has(type);
                                const color = incidentsData.find(i => i.type === type).color;
                                return (
                                    <button
                                        key={type}
                                        onClick={() => handleToggleFilter(type)}
                                        className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center gap-3 transition-colors ${isActive ? 'nav-accent-text' : 'nav-text-secondary nav-hover-bg'}`}
                                    >
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
                                        {type}
                                    </button>
                                );
                            })}
                            {activeFilters.size > 0 && (
                                <button onClick={handleResetFilters} className="text-xs nav-accent-text hover:underline mt-2 px-1 self-start">
                                    Réinitialiser
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Buttons */}
                <div className="w-full flex flex-col items-center space-y-2 mt-6 flex-shrink-0">
                    <button onClick={handleThemeChange} className="w-full flex items-center gap-4 p-3 rounded-xl nav-text-secondary nav-hover-bg" title="Changer de thème">
                        <Icon path={themeIcons[currentTheme]} className="w-5 h-5 flex-shrink-0" />
                        <span className="font-semibold">Thème</span>
                    </button>
                </div>
            </aside>
        </>
    );
}



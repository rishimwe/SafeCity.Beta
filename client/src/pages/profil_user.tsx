import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
 // Ajout de ArrowLeft à l'import// Ajout de ArrowLeft à l'import
import {
  Shield,
  Palette,
  FileText,
  Image as ImageIcon,
  Star,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

// --- Dictionnaire des thèmes (identique) ---
const themes = {
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-indigo-100",
    header: "bg-white/80",
    card: "bg-white",
    textPrimary: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    skeleton: "bg-gray-200",
  },
  dark: {
    bg: "bg-gray-900",
    header: "bg-gray-800/80",
    card: "bg-gray-800",
    textPrimary: "text-white",
    textSecondary: "text-gray-400",
    border: "border-gray-700",
    skeleton: "bg-gray-700",
  },
  darkBlue: {
    bg: "bg-gradient-to-br from-slate-900 to-blue-900",
    header: "bg-slate-800/80",
    card: "bg-slate-800",
    textPrimary: "text-white",
    textSecondary: "text-gray-300",
    border: "border-slate-700",
    skeleton: "bg-slate-600",
  },
};

// --- Helper pour formater le temps écoulé ---
// --- Helper pour formater le temps écoulé (VERSION CORRIGÉE) ---
function formatTimeAgo(date) {
  // On s'assure que 'date' est bien un objet Date avant de faire le calcul
  const dateObject = date instanceof Date ? date : new Date(date);

  const seconds = Math.floor((new Date() - dateObject) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `il y a ${Math.floor(interval)} an(s)`;
  interval = seconds / 2592000;
  if (interval > 1) return `il y a ${Math.floor(interval)} mois`;
  interval = seconds / 86400;
  if (interval > 1) return `il y a ${Math.floor(interval)} jour(s)`;
  interval = seconds / 3600;
  if (interval > 1) return `il y a ${Math.floor(interval)} heure(s)`;
  interval = seconds / 60;
  if (interval > 1) return `il y a ${Math.floor(interval)} minute(s)`;
  return "à l'instant";
}

// --- Données Mock améliorées pour le profil ---
const now = new Date();
const userProfileData = {
  name: "Ana Silva",
  username: "@ana_lisbon_sentinel",
  avatarUrl:
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop",
  joinDate: "Membre depuis juillet 2024",
  stats: {
    posts: 28,
    reputation: "1,250",
    followers: 142,
  },
  posts: [
    {
      id: 1,
      type: "Photo",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      content:
        "Graffiti sur le mur près de la station de métro Baixa-Chiado. Signalé via l'app.",
      imageUrl:
        "https://images.unsplash.com/photo-1528747045269-390a3338fffb?q=80&w=2070&auto=format&fit=crop",
      upvotes: 42,
      comments: 5,
      isUpvoted: true,
    },
    {
      id: 2,
      type: "Post",
      date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      content:
        "Attention, éclairage public défectueux dans une ruelle d'Alfama. Soyez prudents la nuit.",
      imageUrl: null,
      upvotes: 78,
      comments: 12,
      isUpvoted: false,
    },
    {
      id: 3,
      type: "Photo",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      content:
        "Vol de vélo signalé près du Parque Eduardo VII. Voici une photo de la zone.",
      imageUrl:
        "https://images.unsplash.com/photo-1593699931790-244a3d55193a?q=80&w=1968&auto=format&fit=crop",
      upvotes: 55,
      comments: 8,
      isUpvoted: false,
    },
    {
      id: 4,
      type: "Post",
      date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      content:
        "Rappel amical : n'oubliez pas de verrouiller vos portes et fenêtres, même pour une courte absence.",
      imageUrl: null,
      upvotes: 112,
      comments: 23,
      isUpvoted: true,
    },
  ],
};

// --- Composant Squelette ---
const ProfilePostSkeleton = ({ theme }) => (
  <div className={`${theme.card} rounded-2xl shadow-lg p-6 animate-pulse`}>
    <div className={`h-4 w-3/4 rounded ${theme.skeleton} mb-4`}></div>
    <div className={`h-4 w-1/2 rounded ${theme.skeleton} mb-6`}></div>
    <div className={`h-40 w-full rounded-lg ${theme.skeleton} mb-6`}></div>
    <div className="flex justify-between">
      <div className={`h-6 w-16 rounded-full ${theme.skeleton}`}></div>
      <div className={`h-6 w-16 rounded-full ${theme.skeleton}`}></div>
    </div>
  </div>
);

// --- Composant Post pour le profil ---
const ProfilePostCard = ({ post: initialPost, theme }) => {
  const [post, setPost] = useState(initialPost);

  const handleUpvote = () => {
    setPost((p) => ({
      ...p,
      isUpvoted: !p.isUpvoted,
      upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1,
    }));
  };

  return (
    <div
      className={`${theme.card} rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}
    >
      <p className={`${theme.textSecondary} text-sm mb-3 flex-grow`}>
        {post.content}
      </p>
      {post.imageUrl && (
        <div className="my-4 rounded-lg overflow-hidden">
          <img
            src={post.imageUrl}
            alt="Contenu du post"
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div
        className={`flex justify-between items-center text-sm pt-4 mt-auto border-t ${theme.border}`}
      >
        <span className={`${theme.textSecondary}`}>
          {formatTimeAgo(post.date)}
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleUpvote}
            className={`flex items-center transition-colors duration-200 ${post.isUpvoted ? "text-yellow-500" : theme.textSecondary}`}
          >
            <Star
              className={`h-5 w-5 mr-1 ${post.isUpvoted ? "fill-current" : ""}`}
            />
            <span className="font-semibold">{post.upvotes}</span>
          </button>
          <div className={`flex items-center ${theme.textSecondary}`}>
            <MessageSquare className="h-5 w-5 mr-1 text-blue-500" />
            <span className="font-semibold">{post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Composant principal de la page de profil ---
const ProfilePage = ({ theme }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    if (activeTab === "media") {
      return userProfileData.posts.filter((p) => p.imageUrl);
    }
    return userProfileData.posts; // 'posts' tab shows all
  }, [activeTab]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const TabButton = ({ type, label, icon: IconComponent }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`flex items-center px-4 py-2 text-sm font-semibold transition-colors duration-200 ${activeTab === type ? `border-b-2 border-primary ${theme.textPrimary}` : `${theme.textSecondary} hover:${theme.textPrimary}`}`}
    >
      <IconComponent className="inline-block h-4 w-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className={`${theme.card} rounded-2xl shadow-2xl p-6 md:p-8 mb-8`}>
        <div className="flex flex-col md:flex-row items-center">
          <img
            src={userProfileData.avatarUrl}
            alt="Avatar de l'utilisateur"
            className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-primary ring-offset-4 ring-offset-transparent shadow-lg"
          />
          <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
            <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>
              {userProfileData.name}
            </h1>
            <p className="text-primary font-semibold">
              {userProfileData.username}
            </p>
            <p className={`text-sm ${theme.textSecondary} mt-1`}>
              {userProfileData.joinDate}
            </p>
          </div>
        </div>
        <div
          className={`mt-8 pt-6 border-t ${theme.border} grid grid-cols-3 gap-4 text-center`}
        >
          <div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              {userProfileData.stats.posts}
            </p>
            <p className={`${theme.textSecondary} text-sm font-medium`}>
              Posts
            </p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              {userProfileData.stats.reputation}
            </p>
            <p className={`${theme.textSecondary} text-sm font-medium`}>
              Réputation
            </p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${theme.textPrimary}`}>
              {userProfileData.stats.followers}
            </p>
            <p className={`${theme.textSecondary} text-sm font-medium`}>
              Followers
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className={`flex space-x-2 border-b ${theme.border} mb-8`}>
          <TabButton type="posts" label="Publications" icon={FileText} />
          <TabButton type="media" label="Média" icon={ImageIcon} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfilePostSkeleton theme={theme} />
            <ProfilePostSkeleton theme={theme} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <ProfilePostCard key={post.id} post={post} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Composant App pour la démo (MODIFIÉ) ---
export default function App() {
  const [theme, setTheme] = useState("blue");
  const currentTheme = themes[theme];

  // Fonction pour revenir à la page précédente
  const goBack = () => {
    window.history.back();
  };

  const ThemeSwitcher = () => (
    <div className="fixed bottom-6 right-6 z-50 group">
      <button
        className="bg-primary text-white rounded-full shadow-lg h-12 w-12 flex items-center justify-center"
        style={{ "--color-primary": "#7c3aed" }}
      >
        <Palette className="h-6 w-6" />
      </button>
      <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 space-y-1 w-36">
        <button
          onClick={() => setTheme("blue")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Thème Clair
        </button>
        <button
          onClick={() => setTheme("dark")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Thème Sombre
        </button>
        <button
          onClick={() => setTheme("darkBlue")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          Bleu Sombre
        </button>
      </div>
    </div>
  );

  return (
    // Définition de la variable CSS pour la couleur primaire
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-500 font-sans`}
      style={{ "--color-primary": "#7c3aed" }}
    >
      <style>{`.text-primary { color: var(--color-primary); } .ring-primary { --tw-ring-color: var(--color-primary); } .border-primary { border-color: var(--color-primary); } .bg-primary { background-color: var(--color-primary); }`}</style>

      <ThemeSwitcher />

      {/* HEADER MODIFIÉ POUR INCLURE LE BOUTON RETOUR */}
      <header
        className={`${currentTheme.header} backdrop-blur-lg shadow-sm sticky top-0 z-40`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="text-primary" size={28} />
              <h1 className={`text-xl font-bold ${currentTheme.textPrimary}`}>
                SafeCity
              </h1>
            </div>
            {/* BOUTON RETOUR AJOUTÉ ICI */}
            <button
              onClick={goBack}
              title="Retour"
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main>
        <ProfilePage theme={currentTheme} />
      </main>
    </div>
  );
}

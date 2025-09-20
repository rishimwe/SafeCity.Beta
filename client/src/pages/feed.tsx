import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation, Router, Switch, Route } from "wouter";

// --- HOOK MOCK (SIMULATION) ---
// Pour que le code soit fonctionnel, on importe le hook useAuth
// Dans une vraie app, ce serait import { useAuth } from './hooks/useAuth';
const useAuth = () => ({
  user: {
    firstName: 'John',
    email: 'john.doe@example.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'
  }
});


// --- COMPOSANTS D'ICÔNES (DE LA PAGE FEED) ---
const Shield = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> );
const Palette = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.47-1.125-.29-.289-.69-.46-1.128-.46-.744 0-1.345.602-1.345 1.345 0 .743.601 1.345 1.345 1.345.744 0 1.345-.602 1.345-1.345 0-.743-.601-1.345-1.345-1.345-.744 0-1.345.602-1.345 1.345 0 .743.601 1.345 1.345 1.345.744 0 1.345-.602 1.345-1.345 0-.743-.601-1.345-1.345-1.345-.744 0-1.345.602-1.345 1.345 0 .743.601 1.345 1.345 1.345.744 0 1.345-.602 1.345-1.345 0-.743-.601-1.345-1.345-1.345-.744 0-1.345.602-1.345 1.345s.601 1.345 1.345 1.345c.744 0 1.345-.602 1.345-1.345s-.601-1.345-1.345-1.345"></path></svg> );
const ArrowUpCircle = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><path d="m16 12-4-4-4 4"></path><path d="M12 16V8"></path></svg> );
const MessageCircle = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg> );
const Share2 = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg> );
const TrendingUp = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg> );
const Clock = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> );
const MapPin = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> );
const ChevronDown = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"></path></svg> );
const X = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg> );
const Send = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" x2="11" y1="2" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> );
const ImagePlus = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path><line x1="16" x2="22" y1="5" y2="5"></line><line x1="19" x2="19" y1="2" y2="8"></line><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg> );
const VideoIcon = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8Z"></path><rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect></svg> );
const LocateFixed = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="2" x2="5" y1="12" y2="12"></line><line x1="19" x2="22" y1="12" y2="12"></line><line x1="12" x2="12" y1="2" y2="5"></line><line x1="12" x2="12" y1="19" y2="22"></line><circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle></svg> );
// *** NOUVELLE ICÔNE ***
const ArrowLeft = ({ className, size = 24 }) => ( <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> );


// --- COMPOSANT D'ICÔNE ET CONSTANTES (DE LA NAVBAR) ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
);
const ICONS = {
    feed: "M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M4 4v5h5",
    profile: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    collapse: "M11 19l-7-7 7-7m8 14l-7-7 7-7",
    expand: "M13 5l7 7-7 7M5 5l7 7-7 7",
};

// --- DICTIONNAIRE DES THÈMES ---
const themes = {
  blue: { bg: 'bg-gradient-to-br from-blue-50 to-indigo-100', header: 'bg-white/80', card: 'bg-white', textPrimary: 'text-gray-900', textSecondary: 'text-gray-600', border: 'border-gray-200', skeleton: 'bg-gray-200', filterBg: 'bg-white/70', inputBg: 'bg-gray-100' },
  dark: { bg: 'bg-gray-900', header: 'bg-gray-800/80', card: 'bg-gray-800', textPrimary: 'text-white', textSecondary: 'text-gray-400', border: 'border-gray-700', skeleton: 'bg-gray-700', filterBg: 'bg-gray-900/70', inputBg: 'bg-gray-700' },
  darkBlue: { bg: 'bg-gradient-to-br from-slate-900 to-blue-900', header: 'bg-slate-800/80', card: 'bg-slate-800', textPrimary: 'text-white', textSecondary: 'text-gray-300', border: 'border-slate-700', skeleton: 'bg-slate-600', filterBg: 'bg-slate-900/70', inputBg: 'bg-slate-700' }
};

// --- DONNÉES MOCK ---
const now = new Date();
const initialPosts = [
  { id: 1, location: 'Lisbonne', user: { name: 'Rui Costa', username: '@rui_c', avatarUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop' }, date: new Date(now.getTime() - 2 * 60 * 60 * 1000), content: 'Un groupe suspect rôde près du Miradouro da Senhora do Monte.', media: null, upvotes: 128, comments: [{id: 1, user: {name: 'Sofia'}, text: 'Merci pour l\'info !'}, {id: 2, user: {name: 'Pedro'}, text: 'J\'ai vu la même chose hier.'}], isUpvoted: false },
  { id: 2, location: 'Lisbonne', user: { name: 'Ana Silva', username: '@ana_lisbon_sentinel', avatarUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop' }, date: new Date(now.getTime() - 5 * 60 * 60 * 1000), content: 'Le trottoir est défoncé sur la Rua Augusta.', media: { type: 'image', url: 'https://images.unsplash.com/photo-1619462744362-652315798b3a?q=80&w=1964&auto=format&fit=crop' }, upvotes: 92, comments: [], isUpvoted: true },
  { id: 3, location: 'Porto', user: { name: 'Diogo J.', username: '@diogo_porto', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop' }, date: new Date(now.getTime() - 8 * 60 * 60 * 1000), content: 'Attention aux pickpockets près du Pont Dom-Luís I.', media: null, upvotes: 154, comments: [], isUpvoted: false },
];

// --- HELPERS & COMPOSANTS UTILITAIRES ---
const formatTimeAgo = (date) => { const dateObject = date instanceof Date ? date : new Date(date); const seconds = Math.floor((new Date() - dateObject) / 1000); let interval = seconds / 31536000; if (interval > 1) return `il y a ${Math.floor(interval)} an(s)`; interval = seconds / 2592000; if (interval > 1) return `il y a ${Math.floor(interval)} mois`; interval = seconds / 86400; if (interval > 1) return `il y a ${Math.floor(interval)} jour(s)`; interval = seconds / 3600; if (interval > 1) return `il y a ${Math.floor(interval)} heure(s)`; interval = seconds / 60; if (interval > 1) return `il y a ${Math.floor(interval)} minute(s)`; return "à l'instant"; };
const SkeletonCard = ({ theme }) => ( <div className={`${theme.card} rounded-2xl shadow-lg p-6`}> <div className="flex items-center mb-4 animate-pulse"> <div className={`w-12 h-12 rounded-full ${theme.skeleton} mr-4`}></div> <div className="flex-1"> <div className={`h-4 w-1/3 rounded ${theme.skeleton} mb-2`}></div> <div className={`h-3 w-1/2 rounded ${theme.skeleton}`}></div> </div> </div> <div className={`h-4 rounded ${theme.skeleton} w-full mb-2`}></div> <div className={`h-4 rounded ${theme.skeleton} w-5/6 mb-4`}></div> <div className={`h-40 rounded-lg ${theme.skeleton} w-full`}></div> </div> );
const Toast = ({ message, show, theme }) => { if (!show) return null; return ( <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-lg z-50 animate-fade-in-out ${theme.card} ${theme.textPrimary}`}> {message} </div> ); };

// --- COMPOSANTS DE LA PAGE FEED ---
const FeedPostCard = ({ post, theme, onCommentClick, onShareClick, onUpvote }) => {
  return (
    <div className={`${theme.card} rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img src={post.user.avatarUrl} alt={`Avatar de ${post.user.name}`} className="w-12 h-12 rounded-full object-cover mr-4" />
          <div>
            <p className={`font-bold ${theme.textPrimary}`}>{post.user.name}</p>
            <p className={`text-sm ${theme.textSecondary}`}>{post.user.username} · {formatTimeAgo(post.date)}</p>
          </div>
        </div>
        <p className={`${theme.textSecondary} mb-4 whitespace-pre-wrap`}>{post.content}</p>
      </div>
      {post.media && (
        <div className="bg-black">
          {post.media.type === 'image' ? (
            <img src={post.media.url} alt="Contenu visuel du post" className="w-full h-auto max-h-[60vh] object-contain" />
          ) : (
            <video src={post.media.url} controls className="w-full h-auto max-h-[60vh] object-contain" />
          )}
        </div>
      )}
      <div className={`p-4 border-t ${theme.border} flex justify-between items-center`}>
        <button onClick={() => onUpvote(post.id)} className={`flex items-center space-x-2 rounded-full px-3 py-1 transition-all duration-200 transform hover:scale-105 ${post.isUpvoted ? 'text-primary bg-primary/10' : `${theme.textSecondary} hover:bg-gray-500/10`}`}>
          <ArrowUpCircle className={`h-6 w-6 transition-transform duration-200 ${post.isUpvoted ? 'fill-current' : ''}`} />
          <span className="font-semibold text-sm">{post.upvotes}</span>
        </button>
        <div className="flex items-center space-x-4">
          <button onClick={() => onCommentClick(post)} className={`flex items-center space-x-2 ${theme.textSecondary} hover:text-primary transition-colors duration-200`}>
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-sm">{post.comments.length}</span>
          </button>
          <button onClick={() => onShareClick(post.id)} className={`${theme.textSecondary} hover:text-primary transition-colors duration-200`}>
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const CreatePostCard = ({ theme, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview({
          url: e.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
    }
  };

  const handlePost = () => {
    if (content.trim() || mediaFile) {
      onCreatePost(content, mediaFile);
      setContent('');
      removeMedia();
    }
  };

  return (
    <div className={`${theme.card} rounded-2xl shadow-lg p-4 mb-8`}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} className={`w-full p-2 border-none rounded-md resize-none ${theme.inputBg} ${theme.textPrimary} focus:ring-2 focus:ring-primary`} placeholder="Signaler quelque chose..." rows="3"></textarea>
      {mediaPreview && (
        <div className="mt-4 relative">
          {mediaPreview.type === 'image' ? (
            <img src={mediaPreview.url} alt="Aperçu" className="rounded-lg w-full max-h-60 object-cover" />
          ) : (
            <video src={mediaPreview.url} controls className="rounded-lg w-full max-h-60" />
          )}
          <button onClick={removeMedia} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors">
            <X size={18} />
          </button>
        </div>
      )}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center space-x-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
          <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className={`${theme.textSecondary} hover:text-primary p-2 rounded-full transition-colors`}>
            <ImagePlus size={22} />
          </button>
          <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className={`${theme.textSecondary} hover:text-primary p-2 rounded-full transition-colors`}>
            <VideoIcon size={22} />
          </button>
        </div>
        <button onClick={handlePost} className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:opacity-50" disabled={!content.trim() && !mediaFile}>
          Publier
        </button>
      </div>
    </div>
  );
};

const CommentsModal = ({ post, theme, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  if (!post) return null;

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(post.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className={`${theme.card} rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col`}>
        <div className={`flex justify-between items-center p-4 border-b ${theme.border}`}>
          <h2 className={`text-lg font-bold ${theme.textPrimary}`}>Commentaires</h2>
          <button onClick={onClose} className={`${theme.textSecondary} hover:text-primary`}><X /></button>
        </div>
        <div className="p-6 space-y-4 overflow-y-auto">
          {post.comments.length > 0 ? post.comments.map(comment => (
            <div key={comment.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-sm">{comment.user.name.charAt(0)}</div>
              <div>
                <p className={`font-semibold text-sm ${theme.textPrimary}`}>{comment.user.name}</p>
                <p className={`${theme.textSecondary}`}>{comment.text}</p>
              </div>
            </div>
          )) : <p className={`${theme.textSecondary} text-center`}>Aucun commentaire pour l'instant.</p>}
        </div>
        <div className={`p-4 mt-auto border-t ${theme.border} flex items-center space-x-2`}>
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddComment()} type="text" placeholder="Ajouter un commentaire..." className={`flex-grow p-2 border rounded-lg ${theme.inputBg} ${theme.textPrimary} focus:ring-2 focus:ring-primary`} />
          <button onClick={handleAddComment} className="bg-primary text-white p-2 rounded-lg shadow hover:bg-primary-dark transition-colors disabled:opacity-50" disabled={!newComment.trim()}><Send className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// --- COMPOSANT BARRE DE NAVIGATION (MODIFIÉ) ---
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function EnhancedNavBar() {
    const [isNavVisible, setIsNavVisible] = useState(false);
    const [activeLink, setActiveLink] = useState('feed'); // 'feed' est maintenant la valeur par défaut

    const [location] = useLocation();
    const { user } = useAuth();

    useEffect(() => {
        // La page par défaut est le feed. Si on est sur '/', on active 'feed'.
        const currentPath = location.split('/')[1] || 'feed';
        setActiveLink(currentPath);
    }, [location]);

    const NavLink = ({ to, icon, label, keyName }) => (
        <Link to={to}>
            <a className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors ${activeLink === keyName ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'}`} title={label}>
                <Icon path={icon} className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold">{label}</span>
            </a>
        </Link>
    );

    return (
        <>
            <div className={`fixed bottom-8 left-4 z-[60] transition-opacity duration-300 ${!isNavVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <button 
                    onClick={() => setIsNavVisible(true)}
                    className="p-3 rounded-xl bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-lg hover:text-blue-500"
                    title="Afficher la navigation"
                >
                    <Icon path={ICONS.expand} className="w-5 h-5" />
                </button>
            </div>

            <aside 
                className="fixed left-0 flex flex-col py-6 px-4 bg-white dark:bg-gray-800 shadow-2xl transition-transform duration-300 ease-in-out z-50 rounded-r-2xl"
                style={{
                    width: '260px',
                    top: '2rem',
                    bottom: '2rem',
                    maxHeight: 'calc(100vh - 4rem)',
                    transform: isNavVisible ? 'translateX(0)' : 'translateX(-110%)',
                }}
            >
                <header className="w-full flex items-center justify-between mb-6 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-500 text-white font-bold text-xl flex-shrink-0">
                            <span>{user?.firstName?.charAt(0) || 'U'}</span>
                        </div>
                        <span className="font-bold text-gray-800 dark:text-gray-100 truncate">{user?.firstName || user?.email || 'Utilisateur'}</span>
                    </div>
                    <button onClick={() => setIsNavVisible(false)} className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" title="Masquer la navigation">
                        <Icon path={ICONS.collapse} className="w-5 h-5" />
                    </button>
                </header>

                <nav className="w-full flex-grow overflow-y-auto pr-2 space-y-2">
                    {/* *** LE LIEN "CARTE" A ÉTÉ SUPPRIMÉ *** */}
                    <NavLink to="/feed" label="Fil d'actualité" icon={ICONS.feed} keyName="feed" />
                    <NavLink to="/profil" label="Mon Profil" icon={ICONS.profile} keyName="profil" />
                </nav>
            </aside>
        </>
    );
}


// --- COMPOSANT PRINCIPAL DE LA PAGE FEED (MODIFIÉ) ---
const FeedPage = ({ theme }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedLocation, setSelectedLocation] = useState('Lisbonne');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalPost, setActiveModalPost] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });
  const locationRef = useRef(null);
  const locations = ['Lisbonne', 'Porto', 'Paris'];

  // *** NOUVELLE FONCTION POUR LE BOUTON RETOUR ***
  const goBack = () => {
    window.history.back();
  };

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = posts.filter(p => p.location === selectedLocation || selectedLocation === 'Ma Position');
    if (sortBy === 'popular') return [...filtered].sort((a, b) => b.upvotes - a.upvotes);
    // CORRECTION :
    if (sortBy === 'recent') return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    //Fin correction
    return filtered;
  }, [posts, sortBy, selectedLocation]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [sortBy, selectedLocation]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationRef]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2000);
  };

  const handleCreatePost = (content, mediaFile) => {
    let media = null;
    if (mediaFile) {
        media = {
            url: URL.createObjectURL(mediaFile),
            type: mediaFile.type.startsWith('image/') ? 'image' : 'video'
        };
    }
    const newPost = { id: Date.now(), location: selectedLocation, user: { name: 'Vous', username: '@me', avatarUrl: 'https://placehold.co/100x100/7c3aed/ffffff?text=M' }, date: new Date(), content, media, upvotes: 0, comments: [], isUpvoted: false };
    setPosts([newPost, ...posts]);
    showToast("Publication créée !");
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
        showToast("La géolocalisation n'est pas supportée par votre navigateur.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            setSelectedLocation("Ma Position");
            setIsLocationOpen(false);
            showToast("Localisation mise à jour !");
        },
        () => {
            showToast("Impossible de récupérer votre position.");
        }
    );
  };

  const handleUpvote = (postId) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, isUpvoted: !p.isUpvoted, upvotes: p.isUpvoted ? p.upvotes - 1 : p.upvotes + 1 } : p));
  };

  const handleAddComment = (postId, text) => {
    const newComment = { id: Date.now(), user: { name: 'Vous' }, text };
    setPosts(posts.map(p => p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p));
    setActiveModalPost(prev => (prev ? { ...prev, comments: [...prev.comments, newComment] } : null));
  };

  const handleShare = (postId) => {
    navigator.clipboard.writeText(`https://safecity.example/post/${postId}`);
    showToast("Lien copié dans le presse-papiers !");
  };

  const FilterButton = ({ type, label, icon: IconComponent }) => (
    <button onClick={() => setSortBy(type)} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${sortBy === type ? `${theme.card} ${theme.textPrimary} shadow-md` : `${theme.textSecondary}`}`}>
      <IconComponent className={`h-4 w-4 ${sortBy === type ? 'text-primary' : ''}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <header className="pt-8 mb-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <Shield className="text-primary" size={32} />
              <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>SafeCity</h1>
            </div>
            {/* *** BLOC DE BOUTONS MODIFIÉ *** */}
            <div className="flex items-center gap-2">
                <button onClick={goBack} title="Retour" className={`p-2 rounded-full transition-all duration-200 ${theme.card} ${theme.textPrimary} shadow hover:bg-gray-500/10`}>
                    <ArrowLeft className="h-5 w-5 text-primary"/>
                </button>
                <button onClick={handleGeolocate} title="Me localiser" className={`p-2 rounded-full transition-all duration-200 ${theme.card} ${theme.textPrimary} shadow hover:bg-gray-500/10`}>
                    <LocateFixed className="h-5 w-5 text-primary"/>
                </button>
                <div className="relative" ref={locationRef}>
                    <button onClick={() => setIsLocationOpen(!isLocationOpen)} className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${theme.card} ${theme.textPrimary} shadow`}>
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{selectedLocation}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isLocationOpen && (
                        <div className={`absolute top-full right-0 mt-2 w-48 rounded-lg shadow-xl ${theme.card} ${theme.border} border z-30 overflow-hidden`}>
                            {locations.map(loc => (
                                <button key={loc} onClick={() => { setSelectedLocation(loc); setIsLocationOpen(false); }} className={`w-full text-left px-4 py-2 ${theme.textSecondary} hover:${theme.textPrimary} hover:bg-gray-500/10`}>
                                    {loc}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <CreatePostCard theme={theme} onCreatePost={handleCreatePost} />
        <div className="space-y-8">
          {isLoading ? (
            <> <SkeletonCard theme={theme} /> <SkeletonCard theme={theme} /> </>
          ) : (
            filteredAndSortedPosts.length > 0 ? (
              filteredAndSortedPosts.map(post => (
                <FeedPostCard key={post.id} post={post} theme={theme} onCommentClick={setActiveModalPost} onShareClick={handleShare} onUpvote={handleUpvote} />
              ))
            ) : (
              <div className={`${theme.card} rounded-2xl p-8 text-center`}>
                <p className={`${theme.textSecondary}`}>Aucune publication pour {selectedLocation}.</p>
              </div>
            )
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center p-4 pointer-events-none z-20">
        <div className={`flex space-x-2 p-2 rounded-full shadow-lg pointer-events-auto ${theme.filterBg} backdrop-blur-sm border ${theme.border}`}>
          <FilterButton type="popular" label="Populaires" icon={TrendingUp} />
          <FilterButton type="recent" label="Récents" icon={Clock} />
        </div>
      </div>

      <CommentsModal post={activeModalPost} theme={theme} onClose={() => setActiveModalPost(null)} onAddComment={handleAddComment} />
      <Toast message={toast.message} show={toast.show} theme={theme} />
    </>
  );
};

// --- COMPOSANT PLACEHOLDER POUR LA PAGE PROFIL ---
const ProfilePage = ({ theme }) => {
    const { user } = useAuth();
    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <header className="pt-8 mb-6">
                <div className="flex items-center space-x-3 max-w-2xl mx-auto">
                    <Shield className="text-primary" size={32} />
                    <h1 className={`text-3xl font-bold ${theme.textPrimary}`}>Mon Profil</h1>
                </div>
            </header>
            <main>
                <div className={`${theme.card} rounded-2xl shadow-lg p-8 flex flex-col items-center`}>
                    <img src={user.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary"/>
                    <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>{user.firstName}</h1>
                    <p className={`${theme.textSecondary}`}>{user.email}</p>
                    <p className="mt-4 text-center">Cette page de profil est un exemple pour démontrer le fonctionnement de la navigation.</p>
                </div>
            </main>
        </div>
    );
};


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// --- COMPOSANT RACINE DE L'APPLICATION ---
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export default function App() {
  const [theme, setTheme] = useState('blue');
  const currentTheme = themes[theme];
  const primaryColor = '#7c3aed';

  const ThemeSwitcher = () => (
    <div className="fixed bottom-6 right-6 z-[60] group">
      <button className="bg-primary text-white rounded-full shadow-lg h-12 w-12 flex items-center justify-center">
        <Palette className="h-6 w-6" />
      </button>
      <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 space-y-1 w-36">
        <button onClick={() => setTheme('blue')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Thème Clair</button>
        <button onClick={() => setTheme('dark')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Thème Sombre</button>
        <button onClick={() => setTheme('darkBlue')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Bleu Sombre</button>
      </div>
    </div>
  );

  return (
    <Router>
      <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500 font-sans`}>
        <style>{`:root { --color-primary: ${primaryColor}; } .text-primary { color: var(--color-primary); } .bg-primary { background-color: var(--color-primary); } .bg-primary-dark { background-color: #6d28d9; } .bg-primary\\/10 { background-color: rgba(124, 58, 237, 0.1); } .fill-current { fill: currentColor; } .focus\\:ring-primary:focus { --tw-ring-color: var(--color-primary); } .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; } .animate-fade-in-out { animation: fadeInOut 2s ease-in-out forwards; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } } @keyframes fadeInOut { 0%, 100% { opacity: 0; transform: translateY(10px); } 10%, 90% { opacity: 1; transform: translateY(0); } }`}</style>

        <EnhancedNavBar />
        <ThemeSwitcher />

        <Switch>
          <Route path="/feed">
            <FeedPage theme={currentTheme} />
          </Route>
          <Route path="/profil">
            <ProfilePage theme={currentTheme} />
          </Route>
          {/* La route racine redirige maintenant vers le feed par défaut */}
          <Route path="/">
            <FeedPage theme={currentTheme} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

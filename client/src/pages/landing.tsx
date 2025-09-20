import { useState } from 'react';
import { Shield, MapPin, Users, TrendingUp, LogIn, BarChart3, Star, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dictionnaire des thèmes pour une gestion facile
const themes = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    header: 'bg-white/80',
    card: 'bg-white',
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-600',
    footer: 'bg-gray-800'
  },
  dark: {
    bg: 'bg-gray-900',
    header: 'bg-gray-800/80',
    card: 'bg-gray-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-400',
    footer: 'bg-black'
  },
  darkBlue: {
    bg: 'bg-gradient-to-br from-slate-900 to-blue-900',
    header: 'bg-slate-800/80',
    card: 'bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-gray-300',
    footer: 'bg-slate-900'
  }
};

export default function Landing() {
  const [theme, setTheme] = useState('blue'); // Thème par défaut
  const currentTheme = themes[theme];

  const ThemeSwitcher = () => (
    // MODIFICATION: Bouton déplacé en bas à droite
    <div className="fixed bottom-6 right-6 z-50 group">
      <Button size="icon" className="bg-primary rounded-full shadow-lg h-12 w-12">
        <Palette className="h-6 w-6" />
      </Button>
      {/* MODIFICATION: Le menu apparaît au-dessus du bouton */}
      <div className="absolute bottom-full mb-2 right-0 hidden group-hover:block bg-white dark:bg-gray-800 shadow-xl rounded-lg p-2 space-y-1 w-36">
        <button onClick={() => setTheme('blue')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Thème Clair</button>
        <button onClick={() => setTheme('dark')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Thème Sombre</button>
        <button onClick={() => setTheme('darkBlue')} className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Bleu Sombre</button>
      </div>
    </div>
  );

  return (
    // Note: La div parente n'a plus besoin de "relative" car le bouton utilise "fixed"
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500`}>
      <ThemeSwitcher />
      {/* Header */}
      <header className={`${currentTheme.header} backdrop-blur-lg shadow-sm sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="text-primary" size={28} />
              <h1 className={`text-xl font-bold ${currentTheme.textPrimary}`}>SafeCity</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg transition-all duration-300"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Le reste du code reste inchangé... */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Hero Section */}
        <section className="text-center py-16 md:py-24">
          <h1 className={`text-4xl font-extrabold tracking-tight ${currentTheme.textPrimary} sm:text-5xl md:text-6xl`}>
            Rendez votre ville
            <span className="text-primary"> plus sûre</span>
          </h1>
          <p className={`mt-6 text-lg ${currentTheme.textSecondary} max-w-3xl mx-auto`}>
            SafeCity est une plateforme communautaire pour signaler et suivre les incidents de sécurité à Lisbonne. 
            Aidez votre communauté à rester informée et en sécurité.
          </p>
          <div className="mt-10">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary text-white hover:bg-primary-dark text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Commencer maintenant
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`${currentTheme.card} p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center`}>
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-5 shadow-md">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-2`}>Carte interactive</h3>
            <p className={`${currentTheme.textSecondary}`}>
              Visualisez les incidents sur une carte en temps réel avec des marqueurs colorés.
            </p>
          </div>
          <div className={`${currentTheme.card} p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center`}>
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-5 shadow-md">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-2`}>Communauté active</h3>
            <p className={`${currentTheme.textSecondary}`}>
              Rejoignez une communauté engagée qui partage des informations pour tous.
            </p>
          </div>
          <div className={`${currentTheme.card} p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center`}>
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-5 shadow-md">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className={`text-xl font-semibold ${currentTheme.textPrimary} mb-2`}>Suivi en temps réel</h3>
            <p className={`${currentTheme.textSecondary}`}>
              Suivez l'évolution des incidents et restez informé des dernières tendances.
            </p>
          </div>
        </section>

        {/* Impact Section */}
        <section className="mt-20 md:mt-28 text-center">
            <h2 className={`text-3xl font-bold ${currentTheme.textPrimary}`}>Notre impact, grâce à vous</h2>
            <p className={`mt-4 text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto`}>Chaque signalement compte et contribue à un environnement plus sûr.</p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl`}>
                    <BarChart3 className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className={`text-4xl font-extrabold ${currentTheme.textPrimary}`}>12,500+</p>
                    <p className={`mt-2 ${currentTheme.textSecondary} font-semibold`}>Signalements traités</p>
                </div>
                <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl`}>
                    <Star className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className={`text-4xl font-extrabold ${currentTheme.textPrimary}`}>98%</p>
                    <p className={`mt-2 ${currentTheme.textSecondary} font-semibold`}>Utilisateurs satisfaits</p>
                </div>
                <div className={`${currentTheme.card} p-6 rounded-2xl shadow-xl sm:col-span-2 md:col-span-1`}>
                    <Zap className="h-10 w-10 text-primary mx-auto mb-3" />
                    <p className={`text-4xl font-extrabold ${currentTheme.textPrimary}`}>25 min</p>
                    <p className={`mt-2 ${currentTheme.textSecondary} font-semibold`}>Temps de réponse moyen</p>
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className={`mt-20 md:mt-28 ${currentTheme.card} rounded-2xl shadow-2xl p-8 md:p-12 text-center`}>
          <h2 className={`text-3xl font-bold ${currentTheme.textPrimary} mb-4`}>
            Prêt à contribuer à la sécurité de votre ville ?
          </h2>
          <p className={`text-lg ${currentTheme.textSecondary} mb-6 max-w-2xl mx-auto`}>
            Connectez-vous pour commencer à signaler des incidents et aider votre communauté.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary text-white hover:bg-primary-dark text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Se connecter avec Replit
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className={`${currentTheme.footer} text-white py-8 mt-16 md:mt-24`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="text-primary" size={24} />
            <span className="text-lg font-semibold">SafeCity</span>
          </div>
          <p className="text-gray-400">
            Ensemble, construisons des villes plus sûres pour tous.
          </p>
        </div>
      </footer>
    </div>
  );
}
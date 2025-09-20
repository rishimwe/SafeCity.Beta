import { Shield, Plus, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface AppHeaderProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  onOpenReport: () => void;
}

export default function AppHeader({ selectedLanguage, onLanguageChange, onOpenReport }: AppHeaderProps) {
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="text-primary text-2xl" />
              <h1 className="text-xl font-bold text-on-surface">SafeCity</h1>
            </div>
            <span className="text-sm text-on-surface-variant hidden sm:block">Lisbonne</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-on-surface hover:text-primary transition-colors">Carte</a>
            <a href="#" className="text-on-surface hover:text-primary transition-colors">Signaler</a>
            <a href="#" className="text-on-surface hover:text-primary transition-colors">Statistiques</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">🇫🇷 FR</SelectItem>
                <SelectItem value="pt">🇵🇹 PT</SelectItem>
                <SelectItem value="en">🇺🇸 ENG</SelectItem>
              </SelectContent>
            </Select>
            {/* Bouton Signaler retiré */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>
                  {user?.firstName || user?.email || 'Utilisateur'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

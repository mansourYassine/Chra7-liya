import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Menu, X, Coins, BookOpen, Home, PlusCircle, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Tableau de bord', icon: Home },
    { path: '/sessions', label: 'Sessions', icon: BookOpen },
    { path: '/creer-session', label: 'Créer une session', icon: PlusCircle },
    { path: '/acheter-points', label: 'Acheter des points', icon: ShoppingCart },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-foreground">
              Chra7 <span className="text-primary">liya</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link key={path} to={path}>
                  <Button
                    variant={isActive(path) ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </nav>
          )}

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Points Badge */}
                <div className="hidden sm:flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2">
                  <Coins className="h-4 w-4 text-secondary" />
                  <span className="font-semibold text-secondary">{user.points}</span>
                  <span className="text-sm text-muted-foreground">points</span>
                </div>

                {/* User Avatar */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {user.prenom[0]}{user.nom[0]}
                  </div>
                  <span className="text-sm font-medium">{user.prenom}</span>
                </div>

                {/* Logout */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-5 w-5" />
                </Button>

                {/* Mobile Menu Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/connexion">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link to="/inscription">
                  <Button>Inscription</Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {/* Mobile Points */}
              <div className="flex items-center gap-2 px-4 py-2 mb-2 rounded-lg bg-secondary/10">
                <Coins className="h-5 w-5 text-secondary" />
                <span className="font-semibold text-secondary">{user?.points}</span>
                <span className="text-sm text-muted-foreground">points disponibles</span>
              </div>
              
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(path) ? 'default' : 'ghost'}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

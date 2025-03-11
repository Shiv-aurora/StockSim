import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { TrendingUp, User, Award, LogOut, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">StockSim</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/portfolio"
                  className={`nav-link ${isActive('/portfolio') ? 'text-primary' : ''}`}
                >
                  <User className="h-5 w-5" />
                  <span>Portfolio</span>
                </Link>
                <Link
                  to="/trade"
                  className={`nav-link ${isActive('/trade') ? 'text-primary' : ''}`}
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Trade</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className={`nav-link ${isActive('/leaderboard') ? 'text-primary' : ''}`}
                >
                  <Award className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-primary" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-destructive hover:text-destructive/80"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-muted-foreground hover:text-foreground px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  Register
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-primary" />
                  ) : (
                    <Moon className="h-5 w-5 text-primary" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
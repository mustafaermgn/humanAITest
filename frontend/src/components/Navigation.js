import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, History, Terminal } from 'lucide-react';
import { Button } from './ui/Button';

const Navigation = ({ onMenuClick }) => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Terminal className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Human AI Test
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className={location.pathname === "/" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}
            >
              Analiz
            </Link>
            <Link
              to="/history"
              className={location.pathname === "/history" ? "text-foreground" : "text-foreground/60 transition-colors hover:text-foreground/80"}
            >
              Geçmiş
            </Link>
          </nav>
        </div>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other tools could go here */}
          </div>
          <nav className="flex items-center">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/history">
                <History className="h-4 w-4" />
                <span className="sr-only">Geçmiş</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;

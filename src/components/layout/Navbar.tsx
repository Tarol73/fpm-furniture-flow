
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Главная', path: '/' },
  { name: 'Услуги', path: '/services' },
  { name: 'Кейсы', path: '/projects' },
  { name: 'Для партнеров', path: '/partners' },
  { name: 'О компании', path: '/about' },
  { name: 'Контакты', path: '/contact' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/c828dd8c-3f9c-4993-b8c4-56f44713a36a.png" 
            alt="FPM Logo" 
            className="h-8 md:h-10" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-fpm-purple',
                location.pathname === link.path ? 'text-fpm-purple' : 'text-gray-700'
              )}
            >
              {link.name}
            </Link>
          ))}
          <Button className="bg-fpm-purple hover:bg-fpm-purple/90 text-white">
            Обсудить проект
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'py-2 text-base font-medium transition-colors',
                  location.pathname === link.path ? 'text-fpm-purple' : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button className="w-full mt-4 bg-fpm-purple hover:bg-fpm-purple/90 text-white">
              Обсудить проект
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

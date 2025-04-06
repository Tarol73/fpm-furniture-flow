
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Главная', path: '/' },
  { name: 'Заказчикам', path: '/services' },
  { name: 'Партнерам', path: '/partners' },
  { name: 'Кейсы', path: '/projects' },
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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-md',
        isScrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/c828dd8c-3f9c-4993-b8c4-56f44713a36a.png" 
            alt="FPM Logo" 
            className="h-12 md:h-14" 
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-lg font-light transition-colors hover:text-fpm-teal',
                location.pathname === link.path ? 'text-fpm-teal' : 'text-gray-700'
              )}
            >
              {link.name}
            </Link>
          ))}
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
                  'py-2 text-base font-light transition-colors',
                  location.pathname === link.path ? 'text-fpm-teal' : 'text-gray-700'
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button className="w-full mt-4 bg-fpm-teal hover:bg-fpm-teal/90 text-white font-light">
              Обсудить проект
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ theme, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Bikes', path: '/bikes' },
    { name: 'Admin', path: '/login' }
  ];

  return (
    <nav className="navbar" style={{ padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent-color)' }}>
          <Bike size={28} />
          <span>Moto<span style={{ color: 'var(--text-primary)' }}>Wheels</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                style={{ 
                  fontWeight: '500', 
                  color: location.pathname === link.path ? 'var(--accent-color)' : 'var(--text-secondary)',
                  transition: 'color 0.2s ease'
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>

          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="mobile-only">
          <button onClick={toggleTheme} className="btn-icon" aria-label="Toggle dark mode">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="btn-icon">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', backgroundColor: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}
          >
            <div className="container" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ 
                    fontWeight: '500', 
                    padding: '0.5rem 0',
                    color: location.pathname === link.path ? 'var(--accent-color)' : 'var(--text-secondary)'
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

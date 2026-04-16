import React from 'react';
import { Bike, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-secondary)', paddingTop: '3rem', paddingBottom: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="grid md:grid-cols-3" style={{ gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--accent-color)', marginBottom: '1rem' }}>
              <Bike size={24} />
              <span>Moto<span style={{ color: 'var(--text-primary)' }}>Wheels</span></span>
            </Link>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', maxWidth: '300px' }}>
              Your premium destination for the best motorcycles in town. Experience the thrill of riding with our top-notch collection.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: 'var(--text-secondary)' }}><Globe size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
              <li><Link to="/bikes" style={{ color: 'var(--text-secondary)' }}>All Bikes</Link></li>
              <li><Link to="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Contact Info</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
              <li>123 Rider's Avenue, Moto City 10010</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Email: hello@motowheels.com</li>
            </ul>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          &copy; {new Date().getFullYear()} MotoWheels. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IndianRupee, Gauge, Droplets } from 'lucide-react';

const BikeCard = ({ bike, customDelay = 0 }) => {
  // Use a fallback image if URL is missing or broken
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: customDelay * 0.1 }}
      whileHover={{ y: -8 }}
      className="bike-card"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ position: 'relative', paddingTop: '60%', overflow: 'hidden' }}>
        <img 
          src={bike.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop'} 
          alt={bike.name} 
          onError={handleImageError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backdropFilter: 'blur(4px)'
        }}>
          {bike.brand}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {bike.name}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '1rem' }}>
          <IndianRupee size={20} />
          <span>{bike.price?.toLocaleString('en-IN')}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Gauge size={16} />
            <span>{bike.engine}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Droplets size={16} />
            <span>{bike.mileage}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/bikes/${bike.id}`} className="btn btn-outline" style={{ flex: 1, padding: '0.5rem' }}>
            Details
          </Link>
          <Link to={`/book/${bike.id}`} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem' }}>
            Book Ride
          </Link>
        </div>
      </div>
      <style>{`
        .bike-card:hover img {
          transform: scale(1.05);
        }
      `}</style>
    </motion.div>
  );
};

export default BikeCard;

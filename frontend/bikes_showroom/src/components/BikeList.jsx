import React from 'react';
import BikeCard from './BikeCard';
import { ServerCrash } from 'lucide-react';

const BikeList = ({ bikes, loading, error }) => {
  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading exciting rides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 1rem' }}>
        <ServerCrash size={48} />
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Oops! Something went wrong</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!bikes || bikes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>No bikes found!</h3>
        <p>Try adjusting your search filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bikes.map((bike, index) => (
        <BikeCard key={bike.id} bike={bike} customDelay={index % 4} />
      ))}
    </div>
  );
};

export default BikeList;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, IndianRupee, Gauge, Droplets, Activity, Bike, Calendar } from 'lucide-react';
import { getBikeById } from '../services/api';

const BikeDetailsPage = () => {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dummyBikes = {
      '1': { id: 1, name: 'Ninja ZX-10R', brand: 'Kawasaki', price: 1600000, engine: '998cc', mileage: '15 kmpl', description: 'The Ninja ZX-10R has a clear purpose: performance. It\'s heavily dependent on aerodynamic innovation, packing a punch suited for the track but street legal.', image_url: 'https://images.unsplash.com/photo-1609630875171-b13213702ffa?q=80&w=1500&auto=format&fit=crop' },
      '2': { id: 2, name: 'Duke 390', brand: 'KTM', price: 310000, engine: '373cc', mileage: '28 kmpl', description: 'The KTM 390 DUKE brings the values that have made motorcycling so amazing for decades together with modern design and performance.', image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1500&auto=format&fit=crop' },
      '3': { id: 3, name: 'YZF R15 V4', brand: 'Yamaha', price: 185000, engine: '155cc', mileage: '40 kmpl', description: 'Born from the legacy of the R-Series, the new R15 V4 shares the same DNA offering supersport performance in a lightweight package.', image_url: 'https://images.unsplash.com/photo-1591637333184-19a8cd872513?q=80&w=1500&auto=format&fit=crop' },
      '4': { id: 4, name: 'Continental GT 650', brand: 'Royal Enfield', price: 319000, engine: '648cc', mileage: '25 kmpl', description: 'A nod to Britain\'s café racer culture, bringing together classic styling and modern engineering for a joyful riding experience.', image_url: 'https://images.unsplash.com/photo-1558981001-1995369a39a0?q=80&w=1500&auto=format&fit=crop' }
    };
    const setDummyData = () => setBike(dummyBikes[id] || dummyBikes['1']);

    const fetchBikeDetails = async () => {
      try {
        setLoading(true);
        const response = await getBikeById(id);
        if (response.data) {
          setBike(response.data);
        } else {
          setDummyData();
        }
      } catch (err) {
        console.error("API Error", err);
        setDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchBikeDetails();
  }, [id]);

  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1500&auto=format&fit=crop';
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p>Loading details...</p>
      </div>
    );
  }

  if (!bike) {
    return <div className="container py-16 text-center">Bike not found.</div>;
  }

  return (
    <div className="container py-8">
      <Link to="/bikes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={20} /> Back to showroom
      </Link>
      
      <div className="grid md:grid-cols-2" style={{ gap: '3rem', alignItems: 'start' }}>
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}
        >
          <img 
            src={bike.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1500&auto=format&fit=crop'} 
            alt={bike.name} 
            onError={handleImageError}
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover', aspectRatio: '4/3' }}
          />
          <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--accent-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}>
            {bike.brand}
          </div>
        </motion.div>
        
        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem', lineHeight: 1.2 }}>{bike.name}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '2rem' }}>
            <IndianRupee size={36} />
            <span>{bike.price?.toLocaleString('en-IN')}</span>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
            {bike.description || `Experience the ultimate thrill with the ${bike.brand} ${bike.name}. Built for those who demand performance, style, and reliability on every journey.`}
          </p>
          
          {/* Key Specs */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Key Specifications</h3>
            
            <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--accent-color)' }}><Gauge size={32} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Engine</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{bike.engine}</div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--accent-color)' }}><Droplets size={32} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Mileage</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{bike.mileage}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--accent-color)' }}><Activity size={32} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#10b981' }}>In Stock</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ color: 'var(--accent-color)' }}><Bike size={32} /></div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Category</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>{bike.brand === 'Royal Enfield' ? 'Cruiser' : 'Sports'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <Link to={`/book/${bike.id}`} className="btn btn-primary" style={{ padding: '1.25rem', fontSize: '1.125rem', width: '100%', justifyContent: 'center' }}>
              <Calendar size={20} /> Schedule a Test Ride
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BikeDetailsPage;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Wrench, Clock } from 'lucide-react';
import { getBikes, getOfflineBikes } from '../services/api';
import BikeList from '../components/BikeList';

const HomePage = () => {
  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  const normalizeBike = (bike) => ({
    ...bike,
    image_url: bike.image_url || bike.imageUrl
  });

  useEffect(() => {
    const setDummyData = () => {
      const dummyData = [
        { id: 1, name: 'Ninja ZX-10R', brand: 'Kawasaki', price: 1600000, engine: '998cc', mileage: '15 kmpl', image_url: 'https://images.unsplash.com/photo-1609630875171-b13213702ffa?q=80&w=1000&auto=format&fit=crop' },
        { id: 2, name: 'Duke 390', brand: 'KTM', price: 310000, engine: '373cc', mileage: '28 kmpl', image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, name: 'YZF R15 V4', brand: 'Yamaha', price: 185000, engine: '155cc', mileage: '40 kmpl', image_url: 'https://images.unsplash.com/photo-1591637333184-19a8cd872513?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, name: 'Continental GT 650', brand: 'Royal Enfield', price: 319000, engine: '648cc', mileage: '25 kmpl', image_url: 'https://images.unsplash.com/photo-1558981001-1995369a39a0?q=80&w=1000&auto=format&fit=crop' }
      ];
      const allBikes = [...dummyData, ...getOfflineBikes().map(normalizeBike)];
      setFeaturedBikes(allBikes.slice(0, 4));
    };

    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await getBikes();
        const offlineBikes = getOfflineBikes().map(normalizeBike);
        if (response.data && response.data.length > 0) {
          const allBikes = [...response.data.map(normalizeBike), ...offlineBikes];
          setFeaturedBikes(allBikes.slice(0, 4));
        } else {
          setDummyData();
        }
      } catch (err) {
        console.error("API Error, utilizing fallbacks", err);
        setDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        height: '80vh', 
        minHeight: '600px', 
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          backgroundImage: 'url(https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=2000&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
          zIndex: -1
        }}></div>
        
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ maxWidth: '600px', color: 'white' }}
          >
            <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Ride Your Dream <span style={{ color: 'var(--accent-color)' }}>Machine</span>
            </h1>
            <p style={{ fontSize: '1.125rem', marginBottom: '2rem', opacity: 0.9 }}>
              Discover our premium collection of highly sought-after sports, cruiser, and street bikes perfectly suited for your next adventure.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/bikes" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Explore Bikes <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Bikes Section */}
      <section className="py-16">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Featured Rides</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Handpicked selections based on performance and popularity.</p>
            </div>
            <Link to="/bikes" style={{ color: 'var(--accent-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <BikeList bikes={featuredBikes} loading={loading} error={error} />
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '5rem 0' }}>
        <div className="container">
          <div className="grid md:grid-cols-3">
            <motion.div whileHover={{ y: -10 }} style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Certified Bikes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Every bike undergoes a rigorous 100-point inspection.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Clock size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Instant Test Ride</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Book a test ride instantly and feel the thrill before you buy.</p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'var(--accent-light)', color: 'var(--accent-color)', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <Wrench size={32} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Free Servicing</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Enjoy 1 year of complimentary scheduled maintenance.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

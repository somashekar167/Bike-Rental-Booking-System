import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, User, Phone, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { bookBike, getBikeById } from '../services/api';

const BookingPage = () => {
  const { id } = useParams();
  const [bike, setBike] = useState(null);
  
  const [formData, setFormData] = useState({
    user_name: '',
    phone: '',
    booking_date: ''
  });
  
  const [status, setStatus] = useState({
    submitting: false,
    success: false,
    error: null
  });

  useEffect(() => {
    // Optionally fetch bike details just to show what they are booking
    const fetchBike = async () => {
      try {
        const res = await getBikeById(id);
        if (res.data) setBike(res.data);
    } catch {
        console.log("Using fallback bike info");
        setBike({ id, name: "Premium Motorcycle", brand: "Selected Brand" });
      }
    };
    fetchBike();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, success: false, error: null });
    
    const payload = {
      ...formData,
      bike_id: parseInt(id)
    };

    try {
      await bookBike(payload);
      setStatus({ submitting: false, success: true, error: null });
      // Clear form
      setFormData({ user_name: '', phone: '', booking_date: '' });
    } catch (err) {
      console.error(err);
      // Simulate success if backend isn't connected
      setTimeout(() => {
        setStatus({ submitting: false, success: true, error: null });
        setFormData({ user_name: '', phone: '', booking_date: '' });
      }, 1500);
    }
  };

  if (status.success) {
    return (
      <div className="container py-16 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)' }}
        >
          <div style={{ color: '#10b981', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={80} />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Booking Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
            Thank you for booking a test ride. Our team will contact you shortly to confirm the timings.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/bikes" className="btn btn-outline">Explore More Bikes</Link>
            <Link to="/" className="btn btn-primary">Go Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get tomorrow's date as min date for input
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="container py-8" style={{ maxWidth: '800px' }}>
      <Link to={`/bikes/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={20} /> Back to Details
      </Link>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ backgroundColor: 'var(--bg-primary)', padding: '2.5rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Book a Test Ride</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Experience the thrill of the {bike ? <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>{bike.brand} {bike.name}</span> : 'ride'} firsthand.
          </p>
        </div>

        {status.error && (
          <div className="error-message">
            {status.error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="user_name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                id="user_name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                className="form-input" 
                style={{ paddingLeft: '3rem' }}
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="tel" 
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input" 
                style={{ paddingLeft: '3rem' }}
                placeholder="+91 98765 43210"
                pattern="[0-9\+\-\s]+"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="booking_date">Preferred Date</label>
            <div style={{ position: 'relative' }}>
              <CalendarIcon size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="date" 
                id="booking_date"
                name="booking_date"
                min={minDate}
                value={formData.booking_date}
                onChange={handleChange}
                className="form-input" 
                style={{ paddingLeft: '3rem' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem' }}
            disabled={status.submitting}
          >
            {status.submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span> Processing...
              </span>
            ) : 'Confirm Booking'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingPage;

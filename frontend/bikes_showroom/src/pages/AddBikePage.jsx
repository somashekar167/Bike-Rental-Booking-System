import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Bike } from 'lucide-react';
import { addBike, addOfflineBike } from '../services/api';

const AddBikePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    engine: '',
    mileage: '',
    imageUrl: '',
    description: ''
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const payload = {
      ...formData,
      price: Number(formData.price),
      imageUrl:
        formData.imageUrl ||
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop',
      description: formData.description || `${formData.brand} ${formData.name}`
    };

    try {
      await addBike(payload);
      setStatus({ loading: false, error: null, success: 'Bike added successfully.' });
      setTimeout(() => navigate('/admin'), 900);
    } catch (err) {
      console.error(err);
      addOfflineBike(payload);
      setStatus({
        loading: false,
        error: null,
        success: 'Backend offline. Bike saved locally and added to dashboard.'
      });
      setTimeout(() => navigate('/admin'), 900);
    }
  };

  return (
    <div className="container py-8" style={{ maxWidth: '900px' }}>
      <button
        onClick={() => navigate('/admin')}
        className="btn btn-outline"
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Bike size={24} color="var(--accent-color)" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Add New Bike</h1>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div className="grid md:grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Bike Name</label>
              <input id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="brand">Brand</label>
              <input id="brand" name="brand" value={formData.brand} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="price">Price (INR)</label>
              <input id="price" name="price" type="number" min="1" value={formData.price} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="engine">Engine</label>
              <input id="engine" name="engine" value={formData.engine} onChange={handleChange} className="form-input" placeholder="e.g. 648cc" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="mileage">Mileage</label>
              <input id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} className="form-input" placeholder="e.g. 25 kmpl" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Image URL (optional)</label>
              <input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows={4}
              placeholder="Write a short description..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {status.error && (
            <div style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>{status.error}</div>
          )}
          {status.success && (
            <div style={{ color: '#10b981', marginBottom: '1rem' }}>{status.success}</div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={status.loading}>
              <Save size={18} /> {status.loading ? 'Saving...' : 'Save Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBikePage;

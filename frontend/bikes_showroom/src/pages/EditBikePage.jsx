import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Bike } from 'lucide-react';
import {
  getBikes,
  getOfflineBikes,
  updateBike,
  updateOfflineBike
} from '../services/api';

const EditBikePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
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
      return;
    }

    const loadBike = async () => {
      const bikeId = Number(id);
      const offlineBike = getOfflineBikes().find((bike) => Number(bike.id) === bikeId);
      if (offlineBike) {
        setFormData({
          name: offlineBike.name || '',
          brand: offlineBike.brand || '',
          price: String(offlineBike.price || ''),
          engine: offlineBike.engine || '',
          mileage: offlineBike.mileage || '',
          imageUrl: offlineBike.imageUrl || offlineBike.image_url || '',
          description: offlineBike.description || ''
        });
        setLoading(false);
        return;
      }

      try {
        const response = await getBikes();
        const matchedBike = (response.data || []).find((bike) => Number(bike.id) === bikeId);
        if (!matchedBike) {
          setStatus({ loading: false, error: 'Bike not found.', success: null });
        } else {
          setFormData({
            name: matchedBike.name || '',
            brand: matchedBike.brand || '',
            price: String(matchedBike.price || ''),
            engine: matchedBike.engine || '',
            mileage: matchedBike.mileage || '',
            imageUrl: matchedBike.imageUrl || matchedBike.image_url || '',
            description: matchedBike.description || ''
          });
        }
      } catch {
        setStatus({ loading: false, error: 'Unable to load bike details.', success: null });
      } finally {
        setLoading(false);
      }
    };

    loadBike();
  }, [id, navigate]);

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

    const bikeId = Number(id);
    const isOfflineBike = getOfflineBikes().some((bike) => Number(bike.id) === bikeId);

    try {
      if (isOfflineBike) {
        updateOfflineBike(bikeId, payload);
      } else {
        await updateBike(bikeId, payload);
      }
      setStatus({ loading: false, error: null, success: 'Bike updated successfully.' });
      setTimeout(() => navigate('/admin'), 900);
    } catch {
      // If backend is down, preserve edits offline.
      updateOfflineBike(bikeId, payload);
      setStatus({
        loading: false,
        error: null,
        success: 'Backend offline. Bike update saved locally.'
      });
      setTimeout(() => navigate('/admin'), 900);
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="spinner"></div></div>;
  }

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
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Edit Bike</h1>
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
              <input id="engine" name="engine" value={formData.engine} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="mileage">Mileage</label>
              <input id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">Image URL</label>
              <input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} />
          </div>

          {status.error && <div style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>{status.error}</div>}
          {status.success && <div style={{ color: '#10b981', marginBottom: '1rem' }}>{status.success}</div>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={status.loading}>
              <Save size={18} /> {status.loading ? 'Updating...' : 'Update Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBikePage;

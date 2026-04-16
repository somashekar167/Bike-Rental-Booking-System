import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ListPlus, Trash2, Edit, Bike, LogOut } from 'lucide-react';
import { getBikes, deleteBike, removeOfflineBike, getOfflineBikes } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, bookings would come from API
  const [bookings] = useState([
    { id: 1, user_name: 'Alex Johnson', phone: '9876543210', bike_name: 'Ninja ZX-10R', booking_date: '2023-11-20' },
    { id: 2, user_name: 'Sarah Smith', phone: '9876543211', bike_name: 'Duke 390', booking_date: '2023-11-22' }
  ]);

  const [activeTab, setActiveTab] = useState('bikes');

  const setDummyData = () => {
    const fallbackBikes = [
      { id: 1, name: 'Ninja ZX-10R', brand: 'Kawasaki', price: 1600000 },
      { id: 2, name: 'Duke 390', brand: 'KTM', price: 310000 },
      { id: 3, name: 'YZF R15 V4', brand: 'Yamaha', price: 185000 }
    ];
    setBikes([...fallbackBikes, ...getOfflineBikes()]);
  };

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        setLoading(true);
        const res = await getBikes();
        const localBikes = getOfflineBikes();
        if (res.data && res.data.length > 0) {
          setBikes([...res.data, ...localBikes]);
        } else {
          setDummyData();
        }
      } catch {
        setDummyData();
      } finally {
        setLoading(false);
      }
    };

    fetchBikes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      removeOfflineBike(id);
      try {
        await deleteBike(id);
        setBikes(bikes.filter((b) => b.id !== id));
      } catch (err) {
        console.error(err);
        // Fallback for UI if API fails
        setBikes(bikes.filter((b) => b.id !== id));
        alert("Simulated delete since backend might be offline.");
      }
    }
  };

  const tableHeaderStyle = { padding: '1rem', textAlign: 'left', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' };
  const tableCellStyle = { padding: '1rem', borderBottom: '1px solid var(--border-color)' };

  return (
    <div className="container py-8">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <LayoutDashboard size={32} color="var(--accent-color)" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        <button 
          onClick={() => setActiveTab('bikes')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontWeight: '600', 
            borderBottom: activeTab === 'bikes' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeTab === 'bikes' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Manage Bikes
        </button>
        <button 
          onClick={() => setActiveTab('bookings')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            fontWeight: '600', 
            borderBottom: activeTab === 'bookings' ? '2px solid var(--accent-color)' : '2px solid transparent',
            color: activeTab === 'bookings' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          View Bookings
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        
        {activeTab === 'bikes' && (
          <div>
            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Inventory Inventory</h2>
              <button className="btn btn-primary" onClick={() => navigate('/admin/add-bike')}>
                <ListPlus size={20} /> Add New Bike
              </button>
            </div>
            
            {loading ? (
              <div className="loader-container"><div className="spinner"></div></div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyle}>ID</th>
                      <th style={tableHeaderStyle}>Bike Name</th>
                      <th style={tableHeaderStyle}>Brand</th>
                      <th style={tableHeaderStyle}>Price (₹)</th>
                      <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bikes.map(bike => (
                      <tr key={bike.id} style={{ transition: 'background-color 0.2s' }}>
                        <td style={tableCellStyle}>#{bike.id}</td>
                        <td style={tableCellStyle}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bike size={16} color="var(--text-secondary)" /> {bike.name}</div></td>
                        <td style={tableCellStyle}>{bike.brand}</td>
                        <td style={tableCellStyle}>{bike.price.toLocaleString('en-IN')}</td>
                        <td style={tableCellStyle}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-icon" style={{ color: '#3b82f6' }} title="Edit" onClick={() => navigate(`/admin/edit-bike/${bike.id}`)}><Edit size={16} /></button>
                            <button className="btn-icon" style={{ color: 'var(--accent-color)' }} onClick={() => handleDelete(bike.id)} title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Test Ride Bookings</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>ID</th>
                    <th style={tableHeaderStyle}>Customer Name</th>
                    <th style={tableHeaderStyle}>Contact</th>
                    <th style={tableHeaderStyle}>Bike Requested</th>
                    <th style={tableHeaderStyle}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id}>
                      <td style={tableCellStyle}>#{booking.id}</td>
                      <td style={tableCellStyle}>{booking.user_name}</td>
                      <td style={tableCellStyle}>{booking.phone}</td>
                      <td style={tableCellStyle}><span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>{booking.bike_name}</span></td>
                      <td style={tableCellStyle}>{new Date(booking.booking_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

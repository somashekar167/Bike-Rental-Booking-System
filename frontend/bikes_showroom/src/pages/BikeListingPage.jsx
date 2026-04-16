import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { getBikes, getOfflineBikes } from '../services/api';
import BikeList from '../components/BikeList';

const BikeListingPage = () => {
  const [bikes, setBikes] = useState([]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState(5000000); // Max initially

  const normalizeBike = (bike) => ({
    ...bike,
    image_url: bike.image_url || bike.imageUrl
  });

  useEffect(() => {
    const setDummyData = () => {
      const dummy = [
        { id: 1, name: 'Ninja ZX-10R', brand: 'Kawasaki', price: 1600000, engine: '998cc', mileage: '15 kmpl', image_url: 'https://images.unsplash.com/photo-1609630875171-b13213702ffa?q=80&w=1000&auto=format&fit=crop' },
        { id: 2, name: 'Duke 390', brand: 'KTM', price: 310000, engine: '373cc', mileage: '28 kmpl', image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop' },
        { id: 3, name: 'YZF R15 V4', brand: 'Yamaha', price: 185000, engine: '155cc', mileage: '40 kmpl', image_url: 'https://images.unsplash.com/photo-1591637333184-19a8cd872513?q=80&w=1000&auto=format&fit=crop' },
        { id: 4, name: 'Continental GT 650', brand: 'Royal Enfield', price: 319000, engine: '648cc', mileage: '25 kmpl', image_url: 'https://images.unsplash.com/photo-1558981001-1995369a39a0?q=80&w=1000&auto=format&fit=crop' },
        { id: 5, name: 'Hayabusa', brand: 'Suzuki', price: 1690000, engine: '1340cc', mileage: '11 kmpl', image_url: 'https://images.unsplash.com/photo-1565513904480-1a13e2f985b9?q=80&w=1000&auto=format&fit=crop' },
        { id: 6, name: 'CBR 1000RR-R', brand: 'Honda', price: 2360000, engine: '999cc', mileage: '16 kmpl', image_url: 'https://images.unsplash.com/photo-1606346740616-0158ed72d1f4?q=80&w=1000&auto=format&fit=crop' }
      ];
      const allBikes = [...dummy, ...getOfflineBikes().map(normalizeBike)];
      setBikes(allBikes);
      setFilteredBikes(allBikes);
    };

    const fetchBikes = async () => {
      try {
        setLoading(true);
        const response = await getBikes();
        const offlineBikes = getOfflineBikes().map(normalizeBike);
        if (response.data && response.data.length > 0) {
          const allBikes = [...response.data.map(normalizeBike), ...offlineBikes];
          setBikes(allBikes);
          setFilteredBikes(allBikes);
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

    fetchBikes();
  }, []);

  const brands = ['All', ...new Set(bikes.map(b => b.brand))];

  useEffect(() => {
    let result = bikes;
    
    // Search filter
    if (searchTerm) {
      result = result.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        b.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Brand filter
    if (selectedBrand !== 'All') {
      result = result.filter(b => b.brand === selectedBrand);
    }
    
    // Price filter
    result = result.filter(b => b.price <= priceRange);
    
    setFilteredBikes(result);
  }, [searchTerm, selectedBrand, priceRange, bikes]);

  return (
    <div className="container py-8">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>All Motorcycles</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Find the perfect ride to match your style and needs.</p>
        </div>

        {/* Filters and Search Bar */}
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name or brand..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '3rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: '1 1 400px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} style={{ color: 'var(--text-secondary)' }} />
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-input"
                style={{ width: 'auto', minWidth: '150px' }}
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              <SlidersHorizontal size={20} style={{ color: 'var(--text-secondary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  Max Price: ₹{parseInt(priceRange).toLocaleString('en-IN')}
                </span>
                <input 
                  type="range" 
                  min="50000" 
                  max="3000000" 
                  step="50000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent-color)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
          Showing {filteredBikes.length} result{filteredBikes.length !== 1 && 's'}
        </div>

        {/* Grid */}
        <BikeList bikes={filteredBikes} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default BikeListingPage;

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';
const LOCAL_BIKES_KEY = 'offlineAddedBikes';
const OFFLINE_ID_START = 1000;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getBikes = () => api.get('/bikes');
export const getBikeById = (id) => api.get(`/bikes/${id}`);
export const bookBike = (data) => api.post('/bookings', data);
export const addBike = (data) => api.post('/bikes', data);
export const updateBike = (id, data) => api.put(`/bikes/${id}`, data);
export const deleteBike = (id) => api.delete(`/bikes/${id}`);
export const getOfflineBikes = () => {
  try {
    const offlineBikes = JSON.parse(localStorage.getItem(LOCAL_BIKES_KEY) || '[]');
    // Migrate old timestamp IDs to clean incremental IDs.
    let nextId = OFFLINE_ID_START;
    const normalizedBikes = offlineBikes.map((bike) => {
      if (Number(bike.id) > 999999999) {
        const migratedBike = { ...bike, id: nextId, isOffline: true };
        nextId += 1;
        return migratedBike;
      }
      return { ...bike, isOffline: bike.isOffline ?? true };
    });
    localStorage.setItem(LOCAL_BIKES_KEY, JSON.stringify(normalizedBikes));
    return normalizedBikes;
  } catch {
    return [];
  }
};

export const saveOfflineBikes = (bikes) => {
  localStorage.setItem(LOCAL_BIKES_KEY, JSON.stringify(bikes));
};

export const getNextOfflineBikeId = () => {
  const maxId = getOfflineBikes().reduce((max, bike) => {
    const bikeId = Number(bike.id);
    return Number.isFinite(bikeId) ? Math.max(max, bikeId) : max;
  }, OFFLINE_ID_START - 1);
  return maxId + 1;
};

export const addOfflineBike = (bike) => {
  const newOfflineBike = {
    ...bike,
    id: getNextOfflineBikeId(),
    isOffline: true
  };
  const updated = [...getOfflineBikes(), newOfflineBike];
  saveOfflineBikes(updated);
  return newOfflineBike;
};

export const updateOfflineBike = (id, payload) => {
  const bikes = getOfflineBikes();
  let found = false;
  const updated = bikes.map((bike) => {
    if (Number(bike.id) === Number(id)) {
      found = true;
      return { ...bike, ...payload, id: Number(id), isOffline: true };
    }
    return bike;
  });
  if (!found) {
    updated.push({ ...payload, id: Number(id), isOffline: true });
  }
  saveOfflineBikes(updated);
};

export const removeOfflineBike = (id) => {
  const filtered = getOfflineBikes().filter((bike) => Number(bike.id) !== Number(id));
  saveOfflineBikes(filtered);
};

export default api;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import api from '../services/api';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    available: true
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/vehicles');
        setVehicles(response.data);
        setFilteredVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    let filtered = vehicles;
    
    if (filters.type) {
      filtered = filtered.filter(vehicle => vehicle.type === filters.type);
    }
    
    if (filters.brand) {
      filtered = filtered.filter(vehicle => 
        vehicle.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(vehicle => vehicle.price_per_day >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(vehicle => vehicle.price_per_day <= filters.maxPrice);
    }
    
    if (filters.available) {
      filtered = filtered.filter(vehicle => vehicle.available);
    }
    
    setFilteredVehicles(filtered);
  }, [filters, vehicles]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Vehicles</h1>
      
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="bike">Bike</option>
              <option value="car">Car</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="Search brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (RS/day)</label>
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (RS/day)</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="available"
                checked={filters.available}
                onChange={handleFilterChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Available only</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found matching your criteria.</p>
          <button 
            onClick={() => setFilters({
              type: '',
              brand: '',
              minPrice: '',
              maxPrice: '',
              available: true
            })}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: ''
  });

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    filterSales();
  }, [filters, sales]);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data);
      setFilteredSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSales = () => {
    let filtered = sales;
    
    if (filters.type) {
      filtered = filtered.filter(sale => sale.type === filters.type);
    }
    
    if (filters.brand) {
      filtered = filtered.filter(sale => 
        sale.brand.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(sale => sale.price >= filters.minPrice);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(sale => sale.price <= filters.maxPrice);
    }
    
    if (filters.condition) {
      filtered = filtered.filter(sale => sale.condition === filters.condition);
    }
    
    setFilteredSales(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading vehicles for sale...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Vehicles for Sale</h1>
        <Link 
          to="/sales/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Sell Your Vehicle
        </Link>
      </div>
      
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (RS)</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (RS)</label>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              name="condition"
              value={filters.condition}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Sales Grid */}
      {filteredSales.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found for sale.</p>
          <button 
            onClick={() => setFilters({
              type: '',
              brand: '',
              minPrice: '',
              maxPrice: '',
              condition: ''
            })}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSales.map(sale => (
            <div key={sale.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={sale.image_url || '/images/placeholder-vehicle.jpg'} 
                alt={`${sale.brand} ${sale.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {sale.brand} {sale.model} ({sale.year})
                </h3>
                <p className="text-gray-600 mb-4">{sale.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-lg font-bold ml-1">${sale.price}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Condition:</span>
                    <span className="text-lg font-bold ml-1 capitalize">{sale.condition}</span>
                  </div>
                </div>
                
                {sale.mileage && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Mileage:</span>
                    <span className="text-lg font-bold ml-1">{sale.mileage.toLocaleString()} miles</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Sold by: {sale.seller_name}</span>
                  <Link 
                    to={`/sales/${sale.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SaleList;
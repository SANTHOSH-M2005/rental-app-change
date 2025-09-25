import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import debounce from 'lodash/debounce';

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: ''
  });

  useEffect(() => {
    async function fetchSales() {
      try {
        const { data } = await api.get('/sales');
        setSales(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error fetching sales:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, []);

  // Debounced brand filter
  const debouncedFilter = useCallback(
    debounce((all, filt) => {
      let result = all;
      if (filt.type) {
        result = result.filter(x => x.type === filt.type);
      }
      if (filt.brand) {
        const term = filt.brand.toLowerCase();
        result = result.filter(x => x.brand.toLowerCase().includes(term));
      }
      if (filt.minPrice) {
        result = result.filter(x => x.price >= Number(filt.minPrice));
      }
      if (filt.maxPrice) {
        result = result.filter(x => x.price <= Number(filt.maxPrice));
      }
      if (filt.condition) {
        result = result.filter(x => x.condition === filt.condition);
      }
      setFiltered(result);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFilter(sales, filters);
  }, [filters, sales, debouncedFilter]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ type: '', brand: '', minPrice: '', maxPrice: '', condition: '' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading vehicles for sale…
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
          <SelectFilter
            label="Type"
            name="type"
            value={filters.type}
            options={['', 'bike', 'car']}
            onChange={handleChange}
          />
          <InputFilter
            label="Brand"
            name="brand"
            value={filters.brand}
            placeholder="Search brand"
            onChange={handleChange}
          />
          <InputFilter
            label="Min Price (RS)"
            name="minPrice"
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <InputFilter
            label="Max Price (RS)"
            name="maxPrice"
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={handleChange}
          />
          <SelectFilter
            label="Condition"
            name="condition"
            value={filters.condition}
            options={['', 'excellent', 'good', 'fair']}
            onChange={handleChange}
          />
        </div>
        <button
          onClick={clearFilters}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No vehicles found for sale.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => (
            <SaleCard key={s.id} sale={s} />
          ))}
        </div>
      )}
    </div>
  );
};

const SelectFilter = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt === '' ? 'All' : capitalize(opt)}
        </option>
      ))}
    </select>
  </div>
);

const InputFilter = ({ label, name, type = 'text', value, placeholder, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded"
    />
  </div>
);

const SaleCard = ({ sale }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
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
          <span className="text-lg font-bold ml-1">₹{sale.price.toLocaleString()}</span>
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
        <span className="text-sm text-gray-500">Seller: {sale.seller_name || 'N/A'}</span>
        <Link
          to={`/sales/${sale.id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);

export default SaleList;

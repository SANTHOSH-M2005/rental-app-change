import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const VehicleDetail = ({ isAuthenticated }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rentalDates, setRentalDates] = useState({
    start_date: '',
    end_date: ''
  });
  const [calculating, setCalculating] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicleAndSeller = async () => {
      try {
        const response = await api.get(`/vehicles/${id}`);
        setVehicle(response.data);
        
        // If vehicle has a seller_id, fetch seller details
        if (response.data.seller_id) {
          const sellerResponse = await api.get(`/users/${response.data.seller_id}`);
          setSeller(sellerResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAndSeller();
  }, [id]);

  useEffect(() => {
    if (rentalDates.start_date && rentalDates.end_date) {
      calculateCost();
    }
  }, [rentalDates]);

  const calculateCost = async () => {
    setCalculating(true);
    try {
      const start = new Date(rentalDates.start_date);
      const end = new Date(rentalDates.end_date);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      const days = Math.ceil(hours / 24);
      
      let cost;
      if (days >= 1) {
        cost = days * vehicle.price_per_day;
      } else {
        cost = hours * vehicle.price_per_hour;
      }
      
      setTotalCost(cost);
    } catch (error) {
      console.error('Error calculating cost:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setBooking(true);
    setError('');

    try {
      await api.post('/rentals', {
        vehicle_id: id,
        ...rentalDates
      });
      alert('Booking successful!');
      navigate('/rentals');
    } catch (error) {
      setError(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading vehicle details...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Vehicle not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Image and Details */}
        <div>
          <img 
            src={vehicle.image_url || '/images/placeholder-vehicle.jpg'} 
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-96 object-cover rounded-lg"
          />
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold">{vehicle.brand} {vehicle.model} ({vehicle.year})</h1>
            <p className="text-gray-600 mt-2">{vehicle.description}</p>
            
            <div className="mt-4">
              <h2 className="text-xl font-semibold">Features</h2>
              <p className="text-gray-600 mt-1">{vehicle.features}</p>
            </div>
            
            <div className="mt-6 flex space-x-6">
              <div>
                <span className="text-sm text-gray-500">Per hour:</span>
                <span className="text-2xl font-bold ml-1">(₹){vehicle.price_per_hour}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Per day:</span>
                <span className="text-2xl font-bold ml-1">(₹){vehicle.price_per_day}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <span className={`px-3 py-1 rounded-full text-sm ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {vehicle.available ? 'Available' : 'Not Available'}
              </span>
            </div>

            {/* Seller Information Section */}
            {seller && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Seller Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-24">Name:</span>
                    <span className="text-gray-600">{seller.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-24">Email:</span>
                    <span className="text-gray-600">{seller.email}</span>
                  </div>
                  {seller.phone && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-24">Phone:</span>
                      <span className="text-gray-600">{seller.phone}</span>
                    </div>
                  )}
                  {seller.location && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-24">Location:</span>
                      <span className="text-gray-600">{seller.location}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-24">Member since:</span>
                    <span className="text-gray-600">
                      {new Date(seller.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Contact Seller Button */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      // You can implement contact modal or direct link
                      if (seller.phone) {
                        window.open(`tel:${seller.phone}`);
                      } else if (seller.email) {
                        window.open(`mailto:${seller.email}`);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Booking Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Book This Vehicle</h2>
          
          {!vehicle.available && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
              This vehicle is currently not available for rental.
            </div>
          )}
          
          <form onSubmit={handleRentalSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                min={new Date().toISOString().slice(0, 16)}
                value={rentalDates.start_date}
                onChange={(e) => setRentalDates({...rentalDates, start_date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!vehicle.available}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                required
                min={rentalDates.start_date || new Date().toISOString().slice(0, 16)}
                value={rentalDates.end_date}
                onChange={(e) => setRentalDates({...rentalDates, end_date: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
                disabled={!vehicle.available || !rentalDates.start_date}
              />
            </div>
            
            {calculating && rentalDates.start_date && rentalDates.end_date && (
              <div className="mb-4 text-blue-600">Calculating cost...</div>
            )}
            
            {totalCost > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded">
                <h3 className="text-lg font-semibold">Estimated Cost</h3>
                <p className="text-2xl font-bold">(₹){totalCost.toFixed(2)}</p>
              </div>
            )}
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={!vehicle.available || booking || !rentalDates.start_date || !rentalDates.end_date}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-semibold disabled:opacity-50"
            >
              {booking ? 'Booking...' : 'Book Now'}
            </button>
            
            {!isAuthenticated && (
              <p className="mt-4 text-sm text-gray-600">
                You need to <a href="/login" className="text-blue-600">login</a> to book this vehicle.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
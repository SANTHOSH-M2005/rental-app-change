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

  // MOTORCYCLE-ONLY image handling - NO BICYCLE IMAGES EVER
  const getVehicleImage = (vehicle) => {
    // If vehicle has a custom image URL, use it
    if (vehicle.image_url) {
      return vehicle.image_url;
    }

    // For bikes, ONLY use MOTORCYCLE images - NO BICYCLES
    if (vehicle.type && vehicle.type.toLowerCase() === 'bike') {
      // Apache 160 (high resolution for detail page)
      return 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3';
    } else if (vehicle.type && vehicle.type.toLowerCase() === 'car') {
      return 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop';
    }

    // Final fallback - motorcycle, NOT bicycle
    return 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3';
  };

  // MOTORCYCLE-ONLY error handling - NO BICYCLE FALLBACKS ANYWHERE
  const handleImageError = (e) => {
    const vehicleType = vehicle?.type ? vehicle.type.toLowerCase() : '';

    if (vehicleType === 'bike') {
      // ONLY MOTORCYCLE IMAGES - ABSOLUTELY NO BICYCLES
      const motorcycleFallbacks = [
        'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3',
        'https://img.autocarindia.com/Features/TVS%20Ronin.jpg?w=700&c=0',
        'https://i.cdn.newsbytesapp.com/images/l65520240516142907.jpeg',
        'https://imgd.aeplcdn.com/370x208/n/cw/ec/209893/r15-right-side-view.jpeg?isig=0&q=80',
        'https://imgd.aeplcdn.com/370x208/n/cw/ec/103183/raider-125-right-side-view-20.png?isig=0&q=80',
        // Additional MOTORCYCLE backups (NOT bicycles)
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800',
        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800'
      ];

      const currentSrc = e.target.src;
      let nextIndex = 0;

      // Find current image and use next one
      for (let i = 0; i < motorcycleFallbacks.length; i++) {
        if (currentSrc === motorcycleFallbacks[i] || currentSrc.includes(motorcycleFallbacks[i].split('?')[0].split('/').pop())) {
          nextIndex = (i + 1) % motorcycleFallbacks.length;
          break;
        }
      }

      console.log(`Bike image failed: ${currentSrc}, trying: ${motorcycleFallbacks[nextIndex]}`);
      e.target.src = motorcycleFallbacks[nextIndex];

    } else if (vehicleType === 'car') {
      // Car-specific fallback images
      const carFallbacks = [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800'
      ];

      const currentSrc = e.target.src;
      let nextIndex = 0;

      for (let i = 0; i < carFallbacks.length; i++) {
        if (currentSrc === carFallbacks[i] || currentSrc.includes(carFallbacks[i].split('?')[0].split('/').pop())) {
          nextIndex = (i + 1) % carFallbacks.length;
          break;
        }
      }

      e.target.src = carFallbacks[nextIndex];

    } else {
      // Generic fallback - MOTORCYCLE, not bicycle
      e.target.src = 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3';
    }
  };

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
      <div className="flex justify-center items-center min-h-screen">
        Loading vehicle details...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-8">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Vehicle Image and Details */}
        <div>
          <img 
            src={getVehicleImage(vehicle)}
            alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-96 object-cover rounded-lg"
            onError={handleImageError}
          />

          <div className="mt-6">
            <h1 className="text-3xl font-bold mb-4">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h1>

            <p className="text-gray-600 mb-4">
              {vehicle.description}
            </p>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <p className="text-gray-600">
                {vehicle.features}
              </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  Per hour: (₹){vehicle.price_per_hour}
                </div>
                <div className="text-lg font-semibold text-blue-600">
                  Per day: (₹){vehicle.price_per_day}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className={`px-3 py-1 text-sm rounded-full ${
                vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {vehicle.available ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>

        {/* Seller Information Section */}
        {seller && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Seller Information</h3>

            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span>
                <span className="ml-2">{seller.name}</span>
              </div>

              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2">{seller.email}</span>
              </div>

              {seller.phone && (
                <div>
                  <span className="font-medium">Phone:</span>
                  <span className="ml-2">{seller.phone}</span>
                </div>
              )}

              {seller.location && (
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{seller.location}</span>
                </div>
              )}

              <div>
                <span className="font-medium">Member since:</span>
                <span className="ml-2">
                  {new Date(seller.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Contact Seller Button */}
            <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Contact Seller
            </button>
          </div>
        )}
      </div>

      {/* Booking Form */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Book This Vehicle</h3>

        {!vehicle.available && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            This vehicle is currently not available for rental.
          </div>
        )}

        <form onSubmit={handleRentalSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date & Time
            </label>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date & Time
            </label>
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
            <div className="text-blue-600">Calculating cost...</div>
          )}

          {totalCost > 0 && (
            <div className="bg-blue-50 p-4 rounded">
              <h4 className="text-lg font-semibold">Estimated Cost</h4>
              <p className="text-2xl font-bold text-blue-600">(₹){totalCost.toFixed(2)}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={booking || !vehicle.available}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {booking ? 'Booking...' : 'Book Now'}
          </button>

          {!isAuthenticated && (
            <div className="text-center text-red-600 mt-2">
              You need to login to book this vehicle.
              <br />
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="text-blue-600 underline mt-1"
              >
                Go to Login
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VehicleDetail;
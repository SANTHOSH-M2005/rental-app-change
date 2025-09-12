  import React from 'react';
  import { Link } from 'react-router-dom';

  const VehicleCard = ({ vehicle }) => {
    // Handle image errors by using a placeholder
    const handleImageError = (e) => {
      e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400';
    };

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <img 
          src={vehicle.image_url || '/images/placeholder-vehicle.jpg'} 
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">
            {vehicle.brand} {vehicle.model} ({vehicle.year})
          </h3>
          <p className="text-gray-600 mb-4">{vehicle.description}</p>
          
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-sm text-gray-500">Per hour:</span>
              <span className="text-lg font-bold ml-1">(₹){vehicle.price_per_hour}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Per day:</span>
              <span className="text-lg font-bold ml-1">(₹){vehicle.price_per_day}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded text-xs ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {vehicle.available ? 'Available' : 'Not Available'}
            </span>
            <Link 
              to={`/vehicles/${vehicle.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default VehicleCard;
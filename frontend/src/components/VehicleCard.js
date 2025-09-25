import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  // Collections of real images
  const bikeImages = [
    'https://img.autocarindia.com/Features/TVS%20Ronin.jpg?w=700&c=0',
    'https://imgd.aeplcdn.com/1056x594/n/cw/ec/205660/apache-160-right-side-view.jpeg?isig=0&q=80&wm=3',
    'https://imgd.aeplcdn.com/370x208/n/cw/ec/103183/raider-125-right-side-view-20.png?isig=0&q=80',
    'https://i.cdn.newsbytesapp.com/images/l65520240516142907.jpeg',
    'https://imgd.aeplcdn.com/370x208/n/cw/ec/209893/r15-right-side-view.jpeg?isig=0&q=80'
  ];

  const carImages = [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1603712610494-93e15447474c?w=400&h=300&fit=crop'
  ];

  // Pick a random image from the appropriate array
  const getVehicleImage = (vehicle) => {
    if (vehicle.type === 'bike') {
      return bikeImages[Math.floor(Math.random() * bikeImages.length)];
    } else if (vehicle.type === 'car') {
      // Prefer custom URL if provided
      return vehicle.image_url || carImages[Math.floor(Math.random() * carImages.length)];
    }
    // Fallback: first bike image
    return bikeImages[0];
  };

  // On error, rotate to the next image
  const handleImageError = (e) => {
    const src = e.target.src;
    const list = vehicle.type === 'car' ? carImages : bikeImages;
    // find current index
    const idx = list.findIndex(u => src.includes(u.split('?')[0].split('/').pop()));
    // next index
    const next = list[(idx + 1) % list.length];
    console.log(`Image failed, trying next: ${next}`);
    e.target.src = next;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={getVehicleImage(vehicle)}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="w-full h-48 object-cover"
        onError={handleImageError}
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {vehicle.brand} {vehicle.model} ({vehicle.year})
        </h3>

        <p className="text-gray-600 mb-3 text-sm">
          {vehicle.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">
            <div className="font-medium text-green-600">
              Per hour: (₹){vehicle.price_per_hour}
            </div>
            <div className="font-medium text-blue-600">
              Per day: (₹){vehicle.price_per_day}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 text-xs rounded ${
            vehicle.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
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

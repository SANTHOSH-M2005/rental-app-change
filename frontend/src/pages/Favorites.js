import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any favorites yet.</p>
          <div className="mt-4 space-x-4">
            <Link to="/vehicles" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Browse Rentals
            </Link>
            <Link to="/sales" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Browse Sales
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map(favorite => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {favorite.type === 'rental' ? (
                <>
                  <img 
                    src={favorite.vehicle_image || '/images/placeholder-vehicle.jpg'} 
                    alt={`${favorite.vehicle_brand} ${favorite.vehicle_model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {favorite.vehicle_brand} {favorite.vehicle_model}
                    </h3>
                    <p className="text-gray-600 mb-4">For Rental</p>
                    <div className="flex justify-between items-center">
                      <Link 
                        to={`/vehicles/${favorite.vehicle_id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <img 
                    src={favorite.sale_image || '/images/placeholder-vehicle.jpg'} 
                    alt={`${favorite.sale_brand} ${favorite.sale_model}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {favorite.sale_brand} {favorite.sale_model}
                    </h3>
                    <p className="text-gray-600 mb-2">For Sale: RS{favorite.sale_price}</p>
                    <p className="text-gray-600 mb-4">For Sale</p>
                    <div className="flex justify-between items-center">
                      <Link 
                        to={`/sales/${favorite.sale_id}`}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                      >
                        View Details
                      </Link>
                      <button 
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
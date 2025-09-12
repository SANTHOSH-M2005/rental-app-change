import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import api from '../services/api';

const Home = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await api.get('/vehicles?available=true&_limit=3');
        setFeaturedVehicles(response.data);
      } catch (error) {
        console.error('Error fetching featured vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Rent Bikes & Cars Easily</h1>
          <p className="text-xl mb-8">Find the perfect vehicle for your next adventure</p>
          <Link 
            to="/vehicles" 
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Browse Vehicles
          </Link>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Vehicles</h2>
          
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map(vehicle => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/vehicles" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose a Vehicle</h3>
              <p className="text-gray-600">Browse our selection of bikes and cars</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Online</h3>
              <p className="text-gray-600">Select your dates and make a reservation</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-700">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Your Ride</h3>
              <p className="text-gray-600">Pick up your vehicle and hit the road</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
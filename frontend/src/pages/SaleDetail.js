import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const SaleDetail = ({ isAuthenticated }) => {
  const { id } = useParams();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const response = await api.get(`/sales/${id}`);
        setSale(response.data);
      } catch (error) {
        console.error('Error fetching sale:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading sale details...</div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Sale not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Image */}
        <div>
          <img 
            src={sale.image_url || '/images/placeholder-vehicle.jpg'} 
            alt={`${sale.brand} ${sale.model}`}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>
        
        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{sale.brand} {sale.model} ({sale.year})</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Price:</span>
              <span className="text-2xl font-bold ml-1">{sale.price}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Condition:</span>
              <span className="text-xl font-bold ml-1 capitalize">{sale.condition}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <span className="text-xl font-bold ml-1 capitalize">{sale.type}</span>
            </div>
            {sale.mileage && (
              <div>
                <span className="text-sm text-gray-500">Mileage:</span>
                <span className="text-xl font-bold ml-1">{sale.mileage.toLocaleString()} miles</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{sale.description}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Seller Information</h2>
            <p className="text-gray-600">Sold by: {sale.seller_name}</p>
            <p className="text-gray-600">Location: {sale.location}</p>
            <p className="text-gray-600">Email: {sale.contact_email}</p>
            {sale.contact_phone && (
              <p className="text-gray-600">Phone: {sale.contact_phone}</p>
            )}
          </div>
          
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Contact the Seller</h3>
            <p className="text-sm text-gray-600">
              Interested in this vehicle? Contact the seller directly using the information above.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
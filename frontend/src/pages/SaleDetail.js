import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const SaleDetail = ({ isAuthenticated, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this sale listing? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await api.delete(`/sales/${id}`);
      alert('Sale listing deleted successfully!');
      navigate('/sales'); // Redirect to sales list after deletion
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete sale listing');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the seller
  const isSeller = isAuthenticated && user && sale && user.id === sale.user_id;

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
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Seller Actions Header */}
      {isSeller && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-yellow-800">Seller Controls</h3>
              <p className="text-yellow-600 text-sm">You are the owner of this listing</p>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Listing
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Vehicle Image */}
        <div className="relative">
          <img 
            src={sale.image_url || '/images/placeholder-vehicle.jpg'} 
            alt={`${sale.brand} ${sale.model}`}
            className="w-full h-96 object-cover rounded-lg"
          />
          {/* Status Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
            sale.status === 'available' ? 'bg-green-100 text-green-800' : 
            sale.status === 'sold' ? 'bg-red-100 text-red-800' : 
            'bg-yellow-100 text-yellow-800'
          }`}>
            {sale.status.toUpperCase()}
          </div>
        </div>
        
        {/* Vehicle Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">{sale.brand} {sale.model} ({sale.year})</h1>
          
          {/* Price Section */}
          <div className="mb-6">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="text-3xl font-bold ml-2 text-blue-600">₹{sale.price.toLocaleString()}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-sm text-gray-500">Condition:</span>
              <span className="text-xl font-bold ml-1 capitalize block mt-1">{sale.condition}</span>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <span className="text-xl font-bold ml-1 capitalize block mt-1">{sale.type}</span>
            </div>
            {sale.mileage && (
              <div>
                <span className="text-sm text-gray-500">Mileage:</span>
                <span className="text-xl font-bold ml-1 block mt-1">{sale.mileage.toLocaleString()} km</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Listed on:</span>
              <span className="text-sm text-gray-700 block mt-1">
                {new Date(sale.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed">{sale.description}</p>
          </div>
          
          {/* Seller Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Seller Information</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-700 font-medium w-24">Name:</span>
                <span className="text-gray-600">{sale.seller_name}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 font-medium w-24">Location:</span>
                <span className="text-gray-600">{sale.location}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-700 font-medium w-24">Email:</span>
                <span className="text-gray-600">{sale.contact_email}</span>
              </div>
              {sale.contact_phone && (
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium w-24">Phone:</span>
                  <span className="text-gray-600">{sale.contact_phone}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Contact the Seller</h3>
            <p className="text-sm text-blue-600 mb-3">
              Interested in this vehicle? Contact the seller directly using the information above.
            </p>
            <div className="flex space-x-3">
              {sale.contact_phone && (
                <a 
                  href={`tel:${sale.contact_phone}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm"
                >
                  📞 Call Seller
                </a>
              )}
              <a 
                href={`mailto:${sale.contact_email}`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded text-sm"
              >
                ✉️ Email Seller
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
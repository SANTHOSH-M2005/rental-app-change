import React, { useState, useEffect } from 'react';
import api from '../services/api';

const RentalList = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get('/rentals');
        setRentals(response.data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleCancel = async (rentalId) => {
    if (window.confirm('Are you sure you want to cancel this rental?')) {
      try {
        await api.put(`/rentals/${rentalId}/cancel`);
        // Update the local state to reflect the cancellation
        setRentals(rentals.map(rental => 
          rental.id === rentalId ? { ...rental, status: 'cancelled' } : rental
        ));
        alert('Rental cancelled successfully');
      } catch (error) {
        alert(error.response?.data?.message || 'Cancellation failed');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your rentals...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Rentals</h1>
      
      {rentals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">You don't have any rentals yet.</p>
          <a href="/vehicles" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Browse Vehicles
          </a>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Vehicle</th>
                <th className="py-3 px-4 text-left">Start Date</th>
                <th className="py-3 px-4 text-left">End Date</th>
                <th className="py-3 px-4 text-left">Total Cost</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rentals.map(rental => (
                <tr key={rental.id}>
                  <td className="py-3 px-4">
                    {rental.brand} {rental.model} ({rental.type})
                  </td>
                  <td className="py-3 px-4">{formatDate(rental.start_date)}</td>
                  <td className="py-3 px-4">{formatDate(rental.end_date)}</td>
                  <td className="py-3 px-4">${rental.total_cost}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(rental.status)}`}>
                      {rental.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {rental.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(rental.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RentalList;
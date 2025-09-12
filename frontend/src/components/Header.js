import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">RentalApp</Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {/* <Link to="/vehicles" className="hover:text-blue-200">Rent</Link> */}
          <Link to="/sales" className="hover:text-blue-200">Rent</Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/favorites" className="hover:text-blue-200">Favorites</Link>
              <span>Hello, {user.name}</span>
              <Link to="/rentals" className="hover:text-blue-200">My Rentals</Link>
              <button 
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link 
                to="/register" 
                className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
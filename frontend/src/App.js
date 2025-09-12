import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleList from './pages/VehicleList';
import VehicleDetail from './pages/VehicleDetail';
import RentalList from './pages/RentalList';
// Add new imports here:
import SaleList from './pages/SaleList';
import CreateSale from './pages/CreateSale';
import SaleDetail from './pages/SaleDetail';
import Favorites from './pages/Favorites';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="/vehicles" element={<VehicleList />} />
            <Route 
              path="/vehicles/:id" 
              element={<VehicleDetail isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/rentals" 
              element={isAuthenticated ? <RentalList /> : <Login onLogin={handleLogin} />} 
            />
            
            {/* ADD NEW ROUTES HERE */}
            <Route path="/sales" element={<SaleList />} />
            <Route 
              path="/sales/new" 
              element={<CreateSale isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/sales/:id" 
              element={<SaleDetail isAuthenticated={isAuthenticated} />} 
            />
            <Route 
              path="/favorites" 
              element={isAuthenticated ? <Favorites /> : <Login onLogin={handleLogin} />} 
            />
            
          </Routes>
        </main>
        
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} RentalApp. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
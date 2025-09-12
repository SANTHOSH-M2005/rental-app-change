const Vehicle = require('../models/Vehicle');

const vehicleController = {
  getAllVehicles: (req, res) => {
    const filters = {
      type: req.query.type,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      available: req.query.available
    };
    
    Vehicle.findAll(filters, (err, vehicles) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(vehicles);
    });
  },
  
  getVehicleById: (req, res) => {
    const vehicleId = req.params.id;
    
    Vehicle.findById(vehicleId, (err, vehicle) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      res.json(vehicle);
    });
  }
};

module.exports = vehicleController;
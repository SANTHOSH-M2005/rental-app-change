const Rental = require('../models/Rental');
const Vehicle = require('../models/Vehicle');

const rentalController = {
  createRental: (req, res) => {
    const { vehicle_id, start_date, end_date } = req.body;
    const user_id = req.userId;
    
    // Basic validation
    if (!vehicle_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'Please provide vehicle_id, start_date, and end_date' });
    }
    
    // Check if vehicle exists and is available
    Vehicle.findById(vehicle_id, (err, vehicle) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      if (!vehicle.available) {
        return res.status(400).json({ message: 'Vehicle is not available' });
      }
      
      // Calculate total cost
      const start = new Date(start_date);
      const end = new Date(end_date);
      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      const days = Math.ceil(hours / 24);
      
      let total_cost;
      if (days >= 1) {
        total_cost = days * vehicle.price_per_day;
      } else {
        total_cost = hours * vehicle.price_per_hour;
      }
      
      // Create rental
      Rental.create(
        { user_id, vehicle_id, start_date, end_date, total_cost },
        (err, newRental) => {
          if (err) {
            return res.status(500).json({ message: 'Error creating rental' });
          }
          
          // Update vehicle availability
          Vehicle.updateAvailability(vehicle_id, false, (err) => {
            if (err) {
              console.error('Error updating vehicle availability:', err);
            }
          });
          
          res.status(201).json({
            message: 'Rental created successfully',
            rental: newRental
          });
        }
      );
    });
  },
  
  getUserRentals: (req, res) => {
    const user_id = req.userId;
    
    Rental.findByUserId(user_id, (err, rentals) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(rentals);
    });
  },
  
  cancelRental: (req, res) => {
    const rentalId = req.params.id;
    const user_id = req.userId;
    
    // First check if the rental belongs to the user
    Rental.findByUserId(user_id, (err, rentals) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      const rental = rentals.find(r => r.id == rentalId);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      
      // Update rental status to cancelled
      Rental.updateStatus(rentalId, 'cancelled', (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error cancelling rental' });
        }
        
        // Make the vehicle available again
        Vehicle.updateAvailability(rental.vehicle_id, true, (err) => {
          if (err) {
            console.error('Error updating vehicle availability:', err);
          }
        });
        
        res.json({ message: 'Rental cancelled successfully' });
      });
    });
  }
};

module.exports = rentalController;
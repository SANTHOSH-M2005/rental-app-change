const VehicleSale = require('../models/VehicleSale');

const saleController = {
  createSale: (req, res) => {
    const saleData = {
      user_id: req.userId,
      ...req.body
    };
    
    VehicleSale.create(saleData, (err, newSale) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating sale listing' });
      }
      res.status(201).json({
        message: 'Sale listing created successfully',
        sale: newSale
      });
    });
  },

  getAllSales: (req, res) => {
    const filters = {
      type: req.query.type,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      condition: req.query.condition
    };
    
    VehicleSale.findAll(filters, (err, sales) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(sales);
    });
  },

  getSaleById: (req, res) => {
    const saleId = req.params.id;
    
    VehicleSale.findById(saleId, (err, sale) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!sale) {
        return res.status(404).json({ message: 'Sale listing not found' });
      }
      
      res.json(sale);
    });
  },

  getUserSales: (req, res) => {
    const user_id = req.userId;
    
    VehicleSale.findByUserId(user_id, (err, sales) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(sales);
    });
  },

  updateSaleStatus: (req, res) => {
    const saleId = req.params.id;
    const { status } = req.body;
    
    VehicleSale.updateStatus(saleId, status, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating sale status' });
      }
      res.json({ message: 'Sale status updated successfully' });
    });
  }
};

module.exports = saleController;
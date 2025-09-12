const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const auth = require('../middleware/auth');

router.get('/', saleController.getAllSales);
router.get('/:id', saleController.getSaleById);

router.use(auth);
router.post('/', saleController.createSale);
router.get('/user/my-sales', saleController.getUserSales);
router.put('/:id/status', saleController.updateSaleStatus);

module.exports = router;
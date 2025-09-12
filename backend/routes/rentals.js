const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', rentalController.createRental);
router.get('/', rentalController.getUserRentals);
router.put('/:id/cancel', rentalController.cancelRental);

module.exports = router;
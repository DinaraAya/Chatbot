const express = require('express')
const { checkBookingStatus } = require('../controllers/bookingController')
const router = express.Router();

router.post('/check-status', checkBookingStatus);

module.exports = router;
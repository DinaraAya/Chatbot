
const express = require('express');
const { predictUserIntent } = require('../controllers/intentController');
const router = express.Router();

router.post('/intent-prediction', predictUserIntent);

module.exports = router;

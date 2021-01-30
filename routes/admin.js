const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.viewDasboard);

module.exports = router;
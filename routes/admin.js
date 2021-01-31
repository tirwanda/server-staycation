const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.viewDasboard);
router.get('/category', adminController.viewCategory);

module.exports = router;
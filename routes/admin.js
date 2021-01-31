const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/dashboard', adminController.viewDasboard);
router.get('/category', adminController.viewCategory);
router.get('/bank', adminController.viewBank);
router.get('/item', adminController.viewItem);

module.exports = router;
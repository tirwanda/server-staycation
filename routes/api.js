const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const { uploadSingle } = require('../middlewares/multer');

router.get('/landingPage', apiController.landingPage);
router.get('/itemDetail/:id', apiController.itemDetail);
router.post('/bookingPage', uploadSingle, apiController.bookingPage);

module.exports = router;

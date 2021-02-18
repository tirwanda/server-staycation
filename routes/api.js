const express = require('express');
const router = express.Router();
// const { uploadSingle, uploadMultiple } = require('../middlewares/multer');

const apiController = require('../controllers/apiController');

router.get('/landingPage', apiController.landingPage);
router.get('/itemDetail/:id', apiController.itemDetail);

module.exports = router;

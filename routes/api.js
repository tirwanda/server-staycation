const express = require('express');
const router = express.Router();
// const { uploadSingle, uploadMultiple } = require('../middlewares/multer');

const apiController = require('../controllers/apiController');

router.get('/landingPage', apiController.landingPage);

module.exports = router;

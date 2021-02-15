const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple } = require('../middlewares/multer');
const auth = require('../middlewares/auth');

const adminController = require('../controllers/adminController');

router.get('/signin', adminController.viewSignin);
router.post('/signin', adminController.actionSignin);
router.use(auth);
router.get('/logout', adminController.actionLogout);
router.get('/dashboard', adminController.viewDasboard);

router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', uploadSingle, adminController.addBank);
router.put('/bank', uploadSingle, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

router.get('/item', adminController.viewItem);
router.get('/item/show-image/:id', adminController.showImageItem);
router.get('/item/:id', adminController.showEditItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.put('/item/:id', uploadMultiple, adminController.editItem);
router.delete('/item/:id/delete', adminController.deleteItem);

router.get('/item/showDetailItem/:itemId', adminController.showDetailItem);
router.post('/item/add/feature', uploadSingle, adminController.addFeature);
router.put('/item/update/feature', uploadSingle, adminController.editFeature);
router.delete('/item/:itemId/feature/:id', adminController.deleteFeature);

router.post('/item/add/activity', uploadSingle, adminController.addActivity);
router.put('/item/update/activity', uploadSingle, adminController.editActivity);
router.delete('/item/:itemId/activity/:id', adminController.deleteActivity);

router.get('/booking', adminController.viewBooking);
router.get('/booking/:bookingId', adminController.showDetailBooking);

module.exports = router;


const AdminController = require("../../controllers/admin/AdminController");
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../../middlewares/passport')(passport);

const fileupload= require('../../middlewares/fileupload');

router.post('/admin/login', AdminController.adminLogin);
router.get('/admin/logout', AdminController.logout);
router.post('/admin/forgotPassword', AdminController.requestForForgotPassword);
router.post('/admin/verify/:code', AdminController.verifyAndUpdatePassword);
router.get('/admin/activateMyAccount/:code', AdminController.activateCustomerAccount);
router.post('/admin/resendActivationLink', AdminController.resendActivationLink);
router.get('/admin/verifyUserLink/:code', AdminController.verifyUserLink);


module.exports = router;
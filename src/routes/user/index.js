"use strict";

// User with Point meeting routing..

const { transaction } = require("objection");
const UserAuthController = require("./../../controllers/user/UserController")
const express = require("express");
const router = express.Router();
const passport = require("passport");
require("./../../middlewares/passport")(passport);
const roleCheck = require("./../../middlewares/rolecheck");
const fileupload = require("../../middlewares/fileupload");

/**
 * Example full URL API :
 * @localURL localhost:3000/api/endpoint.
 * @LiveURL
 */

 
/**
   * Registered
*/

router.post("/registered", UserAuthController.registered);

/**
   * verifyPhone
*/

router.post("/verifyPhone", 
UserAuthController.verifyPhone);



/**
   * forgotPassword
*/ 

router.post('/forgotPass', UserAuthController.forgotPassword);

/**
   * resetPassword
*/

router.post('/resetPass', UserAuthController.resetPassword);

/**
   * Common Login
   * loginUser
*/

router.post('/login', UserAuthController.loginUser);

/**
   * change Passwaord
   * loginUser
*/

router.post('/changePass', 
  passport.authenticate('jwt', {session: false}), 
 UserAuthController.changePassword);


 /**
   * Common App
   * Logout
*/

router.post('/logout', 
  passport.authenticate('jwt', {session: false}), 
 UserAuthController.Logout);


/**
   * User (Person) profile details
   * getInfo
*/

router.get(
   "getInfo",
   passport.authenticate("jwt", { session: false }),
   UserAuthController.getUserInfo
 );

 /**
   * isPersonRegistered 
*/

router.get(
   "isPersonRegistered/:id",
   passport.authenticate("jwt", { session: false }),
   UserAuthController.isPersonRegistered
 );
 

module.exports = router;

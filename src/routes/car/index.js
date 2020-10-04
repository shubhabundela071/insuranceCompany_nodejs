"use strict";

const { transaction } = require("objection");
const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../../middlewares/passport")(passport);
const roleCheck = require("../../middlewares/rolecheck");
const fileupload = require("../../middlewares/fileupload");
const CarController = require("../../controllers/car/CarController");

/**
 * Example full URL API :
 * @localURL localhost:3000/api/endpoint.
 * @LiveURL
 */


 /**
   * resgister car API 
   * admin can update car
*/


router.post('/addUpdateCar', 
  passport.authenticate('jwt', {session: false}), // auth token check
  CarController.addUpdateCar);


/**
   * car details 
   * if pass the id than show the car details
   * /car/:id
*/

router.get(
   "/getAllcarList",
   passport.authenticate("jwt", { session: false }),
   CarController.carList
 );

/**
   * isCarRegistered
*/ 


router.get(
   "isCarRegistered/:id",
   passport.authenticate("jwt", { session: false }),
   CarController.isCarRegistered
 );



module.exports = router;

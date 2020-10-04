
const Car = require("../../models/car");
require('../../global_functions');
require('../../global_constants');

module.exports = {


/**
 * @function: getAllcarList
 * @description: fetched car data including comapny with pagination, search and orderby
 * @param {*} req.query.search
 * @param {*} req.query.limit
 * @param {*} res
 */

 carList :  async (req, res) => {

  //pagination process
    let page = (req.query.page) ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : PER_PAGE;
    let offset = req.query.offset ? req.query.offset : limit * (page - 1);

    //serch by car name
    let search = req.query.search;

    //fetched person data with car and comapny
    let [err, carData] = await to(Car.query().select("id", "carName", "carModel","carColor", "carNo", "companyName")
    .where(builder => {
        if (search)
          return builder.where("carName", "ilike", search + "%");
      })
      .offset(offset)
      .limit(limit)
      .orderBy('created_at', "desc"));
    if (err) {
      return badRequestError(res, "", err.message);
    }
    let responser = {
      carList : carData,
      page: page
    }
    if (carData == "") {
        return badRequestError(res, responser, Message("notFound"));
      }
    return okResponse(res, responser, Message("found"));
  },


  /**
   * Add Update Car (register Car)
   @Description Add Update car if update the car pass the car id
  * @param {stores the requested parameters} req 
*/


addUpdateCar: async (req, res) => {
  let data = req.body;
  let id = parseInt(data.id);
 
  if (!data.carName) {
    return badRequestError(res, "", "Please enter car Name");
  }
  if (!data.companyName) {
    return badRequestError(res, "", "Please enter company !");
  }

  // If you pass id, it will be edited
  let car = [];
      if (id) {
        car = await Car.query()
          .whereNot("id", id)
          .where("carName", "ilike", "%" + data.carName + "%");
      } else {
        car = await Car.query().where(
          "carName",
          "ilike",
          "%" + data.carName + "%"
        );
      }

      const response = await Car.query().upsertGraph(data);
      let msg = "Car added successfully";

      //Update the Car
      if (id) {
        msg = "Car updated successfully";
      }

      return okResponse(res, response, msg);
 },


  /**
    isCarRegistered
    @Description  CarRegistered
    @param {stores the requested parameters} req id (point id)
*/

isCarRegistered: async (req, res) => {
   
  let carId = req.params.carId;
  let [err, CarData] = await to(Point.query().select("id", "carName", "carModel", "carColor", "carNo", "companyName")
  .where("carId", carId)
  .orderBy('created_at', "desc"));
  if (err) {
    return badRequestError(res, "", err.message);
  }
  
  if (CarData == "") {
   return badRequestError(res, CarData, Message("notFond"));
  }
  return okResponse(res, CarData, Message("fond"));
}


};
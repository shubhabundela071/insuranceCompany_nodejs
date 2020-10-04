'use strict';

const User = require('../../models/users');
const validator = require('validator'); //Using validator
//const PhoneOtp = require('./../../middlewares/msg91'); //Using Phone OTP send
const ValidationError = require('objection').ValidationError;
require('../../global_functions');
require('../../global_constants');
const bcrypt = require('bcrypt');
const EMAIL = require('./../../middlewares/email');
const jwt = require('jsonwebtoken');

/**
 * Registered 
 * @description: User can registered for Car insurance company
 * @params req.body;
 * @return promise
 */

const registered = async (req, res) => {
    console.log("User side signup")
    let data = req.body;

    if (!data.name) {
        return badRequestError(res, "", "Please enter Name");
    }

    if (!data.email) {
        return badRequestError(res, "", "Please enter Email");
    }

    if (!data.phoneNo) {
        return badRequestError(res, "", "Please enter Contact number");
    }
    if (!data.age) {
        return badRequestError(res, "", "Please enter Person Age");
    }

    if (!data.password) {
        return badRequestError(res, "", "Please enter password");
    }
    // generete otp
    let ranOtp = Math.floor(1000 + Math.random() * 9000);
    data.emailOTP = ranOtp;

    //OTP sent your Email-Id
    EMAIL.sendEmail(data.email, "Account Activation", "Hii " + data.name + ", <br> Welcome to insurance company <br>Please do not share this OTP with anyone for security reasons. Your OTP is: " + "<b>" + ranOtp + "</b>" + "");

    // User (Person) data inserted
    let err, inserted_user;
    [err, inserted_user] = await to(User.query().insert(data).returning('*'));

    if (err) {
        return badRequestError(res, "", err.message);
    }
    
    return okResponse(res, inserted_user, Message("registered"));
}




/**
 * verifyPhone 
 * @description: verifyPhone (msg91 side)  match otp
 * @param {*} req
 * @param {*} res
 */

const verifyPhone = async (req, res) => {
    console.log("User side Verify Phone");
    let data = req.body;
    if (!data.userId) {
        return badRequestError(res, "", "Please enter Id");
    }
    if (!data.otp) {
        return badRequestError(res, "", Message("validOTP"));
    }
    data.id = data.userId
    const users = await User.query().findById(data.id);
    console.log(users);

    const userphoneOTP = await User.query().select("phoneOTP").findById(data.id).first();
    console.log(userphoneOTP.phoneOTP);
    if (!users) return badRequestError(res, "", Message("userNotRegisterd"));
    if (userphoneOTP.phoneOTP == data.otp) {
        //generete auth token
        let auth_token = await users.getJWT();
        //set header auth token
        res.setHeader('Authorization', auth_token);
        res.setHeader('access-control-expose-headers', 'authorization');
        //update phoneNo flag

        let phoneFlagData = await User.query().patchAndFetchById(data.id, {
            isPhoneVerified: true,
   
            token: auth_token
        });

        //set success response
        let resUpdatedProfile = {
            'userId': data.id
        }

        //not verifyUsers delete
        const oldUserAc = await User.query().select().where("isPhoneVerified", false).whereNot("driverUniqueNo", ">", 0)
        for (let i = 0; i < oldUserAc.length; i++) {
            let userId = oldUserAc[i].id
            let deleteDriver = await User.query().deleteById(userId);
        }

        return okResponse(res, resUpdatedProfile, Message("verifyPhoneOTP"));
    } else {
        return errorResponse(res, '', Message("IncorrectOTP"));
    }
};


/**
 * resetPassword
 * @params req.body.email;
 * @params req.body.newPassword;
 * @return promise
 */

const resetPassword = async (req, res) => {

    let data = req.body;
    if (!data.email) {
        return badRequestError(res, "", "please enter email");
    }
    let user = await User.query().where('email', data.email).first();

    if (!user) {
        return badRequestError(res, "", "user does not exist with this email");
    }

    let newPassword = await bcrypt.hash(data.newPassword, 10);
    console.log("Check Pass" + newPassword);
    const updatedUser = await User.query().patchAndFetchById(user.id, {
        password: newPassword
    });
    return okResponse(res, {}, "password is updated");

}



/**
 * loginUser
 * @params req.body;
 * @return promise
 */


const loginUser = async (req, res) => {
    let data = req.body

    if (!data.email) {
        return badRequestError(res, "", Message("emailRequired"));
    }
    if (!data.password) {
        return badRequestError(res, "", Message("passwordRequired"));
    }
    //User Data fatch by email
    let user = await User.query().where('email', data.email).first();

    if (!user) {
        return badRequestError(res, "", Message("emailNotExist"));
    }
    
    // Password compare
    if (!await user.comparePassword(data.password)) {
        return badRequestError(res, "", Message("invalidPassword"));
    }

    //if in case user not logout and again login different phone than delete device tokens   
    const sameDeviceTokens = await User.query().patch({
        deviceToken: null
    }).where('deviceToken', user.deviceToken);

    // check isEmailVerified
    if (user.isEmailVerified == 0) {
        let ranOtp = Math.floor(1000 + Math.random() * 9000);
        data.emailOTP = ranOtp;

    //send OTP to ur email id
        EMAIL.sendEmail(data.email, "Account Activation", "Hii " + user.name + ", <br> Welcome to insurance company<br>Please do not share this OTP with anyone for security reasons. Your OTP is: " + "<b>" + ranOtp + "</b>" + "");

        //store otp user table
        let updateOTP = await User.query().context({
            email: data.email
        }).update({
            "emailOTP": data.emailOTP

        }).where("email", data.email);

        let response = {
            'id': user.id,
            'email': user.email,
        }
        return unverifiedEmailError(res, response, Message("otpSent"));

    }

    //generate auth_token 
    auth_token = await user.getJWT();
    const devicetype = await User.query().skipUndefined().patchAndFetchById(user.id, {
        deviceType: data.deviceType,
        deviceToken: data.deviceToken,
        token: auth_token
    });

   //set auth Token on Header
    res.setHeader('Authorization', auth_token);
    res.setHeader('access-control-expose-headers', 'authorization');

    return okResponse(res, user, "Login successfully !");

}

/**
 * changePassword
 * @params req.body;
 * @return promise
 */

const changePassword = async (req, res) => {
    let data = req.body;
    if (!data.oldPassword) {
        return badRequestError(res, "", Message("oldPasswordRequired"));
    }
    if (!await (req.user).comparePassword(data.oldPassword)) {
        return badRequestError(res, "", Message("oldPasswordMismatch"));
    } else {
        data.newPassword = await bcrypt.hash(data.newPassword, 10);
        let updatePassWord = await User.query().context({
            id: req.user.id
        }).update({
            "password": data.newPassword
        }).where("id", req.user.id);

        return okResponse(res, {}, Message("updatePass"));
    }
}



/**
 * Logout
 * @params req.body;
 * @return promise
 */

const Logout = async (req, res) => {
    const logout = await User.query()
        .skipUndefined()
        .patchAndFetchById(req.user.id, {
            deviceType: " ",
            deviceToken: " ",
            deviceId: 0,
            token: " "
        });

    return okResponse(res, {}, Message("Logout"));
};

/**
 * @function: Forgot Password (sendEmailOTP)
 * @description: otp varification with register mobile number
 * @param {*} req
 * @param {*} res
 */

const forgotPassword = async (req, res) => {

    let data = req.body;
    if (!data.email) {
        return badRequestError(res, "", "please Enter Email !");
    }
    let user = await User.query().select().where('email', data.email).first();
    if (!user) {
        return badRequestError(res, "", Message("invalidAuth"));
    }

    let ranOtp = Math.floor(1000 + Math.random() * 9000);
    data.emailOTP = ranOtp;
    console.log("data.emailOTP", data.emailOTP)

    EMAIL.sendEmail(data.email, "Account Activation", "Hii " + user.name + ", <br> Welcome to  Company <br>Please do not share this OTP with anyone for security reasons. Your OTP is: " + "<b>" + ranOtp + "</b>" + "");
    let updateOTP = await User.query().context({
        email: data.email
    }).update({
        "emailOTP": data.emailOTP

    }).where("email", data.email);
    if (!user) {
        return badRequestError(res, "", "User does not exist with this email");

    } else {
        let updateEmailOtp = await User.query().context({
            emailOTP: ranOtp
        }).update({
            "emailOTP": ranOtp, //ranOtp

        }).where("email", data.email);
        if (!updateEmailOtp) {
            throw badRequestError(Message("errorParsingResponse"));
        }
        let response = {
            'id': user.id
        }
        return okResponse(res, {
            ...response,
        }, "OTP send Sucessfully your Email!");
    }
}

/**
 * @function: getUserInfo
 * @description: fetched person data including car and comapny with pagination, search and orderby
 * @param {*} req.query.search
 * @param {*} req.query.limit
 * @param {*} res
 */

const getUserInfo =  async (req, res) => {

  //pagination process
    let page = (req.query.page) ? req.query.page : 1;
    let limit = req.query.limit ? req.query.limit : PER_PAGE;
    let offset = req.query.offset ? req.query.offset : limit * (page - 1);

    //serch by person name
    let search = req.query.search;

    //fetched person data with car and comapny
    let [err, UserData] = await to(User.query().select("id", "name", "email","phoneNo", "age", "address")
    .eager("[car]")
      .modifyEager('car', builder => {
              builder.select("id", "carName" ,"carModel", "carNo", "companyName");
            })
      .where(builder => {
        if (search)
          return builder.where("name", "ilike", search + "%");
      })
      .offset(offset)
      .limit(limit)
      .orderBy('created_at', "desc"));
    if (err) {
      return badRequestError(res, "", err.message);
    }
    let responser = {
      personInfo : UserData,
      page: page
    }
    if (personInfo == "") {
        return badRequestError(res, responser, Message("notFound"));
      }
    return okResponse(res, responser, Message("found"));
  }
  

  /**
 * @function: isPersonRegistered
 * @description: carId according person data fetch
 * @param {*} req.parms.carId
 * @param {*} req.query.search
 * @param {*} req.query.limit
 * @param {*} res
 * @return {*} JSON response
 */

const isPersonRegistered =  async (req, res) => {

    //pagination process
      let page = (req.query.page) ? req.query.page : 1;
      let limit = req.query.limit ? req.query.limit : PER_PAGE;
      let offset = req.query.offset ? req.query.offset : limit * (page - 1);
  
      //serch by person name
      let search = req.query.search;
  
      // person list show by carId according
      let carId = req.params.id;
  
      //fetched person data with car and comapny
      let [err, UserData] = await to(User.query().select("id", "name", "email","phoneNo", "age", "address")
      .eager("[car]")
        .modifyEager('car', builder => {
                builder.select("id", "carName" ,"carModel", "carNo");
              })
        .where(builder => {
          if (search)
            return builder.where("name", "ilike", search + "%");
        })
        .where("carId", carId)
        .offset(offset)
        .limit(limit)
        .orderBy('created_at', "desc"));
      if (err) {
        return badRequestError(res, "", err.message);
      }
      let responser = {
        personInfo : UserData,
        page: page
      }
      if (UserData == "") {
          return badRequestError(res, responser, Message("notFound"));
        }
      return okResponse(res, responser, Message("found"));
    }
    

module.exports = {
    registered,
    verifyPhone,
    forgotPassword,
    resetPassword,
    loginUser,
    changePassword,
    Logout,
    getUserInfo,
    isPersonRegistered
}
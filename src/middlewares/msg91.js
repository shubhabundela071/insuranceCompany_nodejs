'use strict';

const got = require('got');
const querystring = require('querystring');

//msg91 supporing file start
let msg91 = require('./../config/msg91');
var http = require('http');
var msg91Package = require("msg91")("123456789", "SenderName", "4" ); //here put the msg91 key and senderName


const SendOTP = function (mobileNo, msg) {
     console.log('SMS send start', mobileNo, msg)
     msg91Package.send(mobileNo, msg, function (err, response) {
       
    });
    msg91Package.getBalance("4", function(err, msgCount){
        console.log("routrt err",err);
        console.log("msg count",msgCount);
    });
};

module.exports = {
     SendOTP
    }

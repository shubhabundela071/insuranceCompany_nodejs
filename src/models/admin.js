'use strict';

const Model = require('objection').Model;
const validator = require('validator');
const ValidationError = require('objection').ValidationError;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



class Admin extends Model {

  static get tableName() {
    return 'admin';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [],

      properties: {
      //  id: { type: 'integer' },
        // name: { type: 'string', minLength: 2, maxLength: 255 },
        // email: { type: 'string', minLength: 1, maxLength: 255 },
      }
    };
  }
//generate JWT Token
  async getJWT() {
    return await jwt.sign({
      userId: this.id
    }, CONFIG.jwt_encryption);
  }

  async comparePassword(password) {
    if (!password) {
      return false;
    }

    let pass = await bcrypt.compare(password, this.password);
    return pass;
  }
  async $beforeInsert() {
   
    await super.$beforeInsert();


    if (!validator.isNumeric(this.mobile_number)) {
      throw badRequestError("Please enter valid mobile number!");
    }

    if (!validator.isLength(this.mobile_number, {
        min: 10,
        max: 10
      })) {

      throw badRequestError('Please enter valid mobile number!');

    }


    if (this.email_id) {
      if (!validator.isEmail(this.email_id || '')) {

        throw badRequestError("Not a valid email address!");
      }

      let result = await this.constructor.query().skipUndefined().select('user_id').where('email_id', this.email_id).first();
      if (result) {
        throw badRequestError("Account with this email already exists!");
      }

    }
    if (this.mobile_number) {
      let result = await this.constructor.query().skipUndefined().select('user_id').where('mobile_number', this.mobile_number).first();
      if (result) {
        throw badRequestError("Account with this mobile number already exists!");
      }
    }
    if (this.password) {

      if (!validator.isLength(this.password, {
          min: 8,
          max: 15
        })) {

        throw badRequestError('Password length must be between 8 - 15 characters.');

      }
      this.password = await bcrypt.hash(this.password, 10);
    }
   // var d = new Date;
    this.created_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);


    this.updated_at = new Date().toISOString();

    if (this.mobile_number) {
      if (!validator.isNumeric(this.mobile_number)) {
        throw badRequestError("Please enter valid mobile number!");
      }

      if (!validator.isLength(this.mobile_number, {
          min: 10,
          max: 10
        })) {
        
        throw badRequestError('Please enter valid mobile number!');

      }
    }



    if (this.email_id) {
      if (!validator.isEmail(this.email_id || '')) {

        throw badRequestError("Not a valid email address!");
      }

      let result = await this.constructor.query().skipUndefined().select('user_id').where('email_id', this.email_id).where('user_id', '!=', this.user_id).first();
      if (result) {
        throw badRequestError("Account with this email already exists!");
      }

    }
    if (this.mobile_number) {
      let result = await this.constructor.query().skipUndefined().select('user_id').where('mobile_number', this.mobile_number).where('user_id', '!=', this.user_id).first();
      if (result) {
        throw badRequestError("Account with this mobile number already exists!");
      }
    }

    if (this.password) {

      if (!validator.isLength(this.password, {
          min: 8,
          max: 15
        })) {

        throw badRequestError('Password length must be between 8 - 15 characters.');
      }
      this.password = await bcrypt.hash(this.password, 10);

    }
  }
  
}

module.exports = Admin;

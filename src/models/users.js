'use strict';

const Model = require('objection').Model;
const ValidationError = require('objection').ValidationError;
const jwt = require('jsonwebtoken');
const Car = require("./car");
const bcrypt = require('bcrypt');
class User extends Model {

  static get tableName() {
    return 'users';
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
      
        name: { type: "string", minLength: 2, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
      
      }

    };
  }
//Car table retation
  static get relationMappings() {
    return {
      car: {
        relation: Model.HasManyRelation,
        modelClass: Car,
        join: {
          from: "users.id",
          to: "car.userId"
        }
      }
      
    };
  }
//generate JWT auth Token
  async getJWT() {
    return await jwt.sign({
      userId: this.id
    }, CONFIG.jwt_encryption);
  }


  async $beforeInsert() {
  
    console.log('in before insert');
    
    this.password ? this.password = await bcrypt.hash(this.password, 10) : null;

  }
  async $beforeUpdate() {

  }

  async comparePassword(password) {
   
    if (!password) {
      return false;
    }
    let pass = await bcrypt.compare(password, this.password);
    if(!pass){
      console.log("update before user model")
      return false;

    }
    
    return pass;
  }

}

module.exports = User;

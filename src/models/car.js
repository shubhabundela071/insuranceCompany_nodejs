"use strict";

const { Model } = require("objection");

class Car extends Model {
  static get tableName() {
    return "car";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
       
      }
    };
  }

  static get relationMappings() {
    const Users = require("./users");
  
    return {
      //users table relation
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: "car.userId",
          to: "users.id"
        }
      }
    };
  }
}

module.exports = Car;

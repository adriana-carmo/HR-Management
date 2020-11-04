// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var role = {
  all: function(cb) {
    orm.all("role", function(res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("role", cols, vals, function(res) {
      cb(res);
    });
  },
  update: function(objColVals, condition, cb) {
    orm.update("role", objColVals, condition, function(res) {
      cb(res);
    });
  },
  delete: function(condition, cb) {
    orm.delete("role", condition, function(res) {
      cb(res);
    });
  }
};                     

// Export the database functions for the controller (management.js).
module.exports = role;

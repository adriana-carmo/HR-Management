// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm.js");

var department = {
  all: function(cb) {
    orm.all("department", function(res) {
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: function(cols, vals, cb) {
    orm.create("department", cols, vals, function(res) {
      cb(res);
    });
  },
  update: function(objColVals, condition, cb) {
    orm.update("department", objColVals, condition, function(res) {
      cb(res);
    });
  },
  delete: function(condition, cb) {
    orm.delete("department", condition, function(res) {
      cb(res);
    });
  }
};                     

// Export the database functions for the controller (management.js).
module.exports = department;

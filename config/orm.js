// Import MySQL connection.
var connection = require("../config/connection.js");

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      //if (typeof value === "string" && value.indexOf(" ") >= 0) {
      if (typeof value === "string") {
        value = "'" + value + "'";
      }
      // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
      // e.g. {sleepy: true} => ["sleepy=true"]
      arr.push(key + "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

// Object for all our SQL statement functions.
var orm = {
  // Select data from table
  all: function(tableInput, cb) {
    
    if(tableInput == "role")
    {
      var queryString = "SELECT t1.id_role,t1.title, t1.salary, t2.name_department";
      queryString += " FROM " + tableInput + " t1 ";
      queryString += " inner join department t2 on ";
      queryString += " t1.id_department = t2.id_department";
    }
    else if(tableInput == "employee"){
      var queryString = "SELECT t.id_employee, t.first_name, t.last_name, id_manager, t1.title, t1.salary, t2.name_department";
      queryString += " FROM " + tableInput + " t ";
      queryString += " inner join role  t1 on "; 
      queryString += " t.id_role = t1.id_role ";
      queryString += " inner join department t2 on "; 
      queryString += " t.id_department = t2.id_department ";
    }
    else if(tableInput == "manage"){
      var queryString = "SELECT t.id_employee, t.first_name, t.last_name, id_manager, t1.title, t1.salary, t2.name_department";
      queryString += " FROM employee t ";
      queryString += " inner join role  t1 on ";
      queryString += " t.id_role = t1.id_role ";
      queryString += " inner join department t2 on "; 
      queryString += " t1.id_department = t2.id_department ";
      queryString += " where id_manager is null ";
    }
    else{
      var queryString = "SELECT * FROM " + tableInput;
    }

    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
      connection.end;
    });
  },
  // Insert data into the table
  create: function(table, cols, vals, cb) {
    var queryString = "INSERT INTO " + table;

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    connection.query(queryString, vals, function(err, result) {
      if (err) {
        throw err;
      }
      cb(result);
      connection.end;
    });
  },
  // Update data into the table - An example of objColVals would be {id_department: 2, name_department: Accounting}
  update: function(table, objColVals, condition, cb) {
    var queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    //console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      cb(result);
      connection.end;
    });
  },
  // delete row through the condition 
  delete: function(table, condition, cb) {
    var queryString = "DELETE FROM " + table;

    queryString += " WHERE ";
    queryString += condition;

    //console.log(queryString);
    connection.query(queryString, function(err, result) {
      if (err) {
        throw err;
      }

      cb(result);
      connection.end;
    });
  }
};

// Export the orm object for the model (cat.js).
module.exports = orm;

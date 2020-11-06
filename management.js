const inquirer = require("inquirer");
const art = require("ascii-art");
const connect  = require("./config/connection");
const department = require("./model/department");
const employee = require("./model/employee");
const role = require("./model/role");

var choiceArray = [];
var DepartmentArray = [];
var RoleArray = [];
var ManagerEmployee = [];

function title(){

    art.font("HR-Management", "Doom", async (err, renderer) => {
        console.log(err || renderer)

        await promptUser();
    });
    
}


function promptUser(){

    
    choiceArray = [];
    DepartmentArray = [];
    RoleArray = [];
    ManagerEmployee = [];

    inquirer.prompt([
        {
          type : "list",
          message : "What would you like to do?",
          choices :[ "Manage Employee",
            "Manage Role",
            "Manage Department",
            "Exit"
          ],
          name: "userChoice" 
        }
    ]).then
    (function(response){
        switch (response.userChoice){
            case "Manage Employee":
                promptEmployee();
            break;
            case "Manage Role":
                promptRole()
            break;
            case "Manage Department":
                promptDepartment()
            break;
            //Exit
            default:
                process.exit();
            break;
        }
    })
}


/****** 
Department Module all actions:
    Select - Add - Update - Remove
*******/
function promptDepartment(){
    inquirer
    .prompt([
        {
            type : "list",
            message : "What would you like to do in Department session?",
            choices : ["View all list of department",
                "Add Department",
                "Update Department",
                "Remove Department",
                "Return main menu"
            ],
            name: "userChoice" 
        }
    ]).then
    (function(option){
        switch (option.userChoice){
            case "Add Department":
                SetDepartment("0");
               
            break;

            case "View all list of department":
                // access database and show department
                 department.all(async function(data) {
                     console.table(data);
                     await promptUser()
                })    
            break;

            case "Return main menu":
                promptUser()
            break;
            
            case "Update Department":
            case "Remove Department":  
                var toDo = option.userChoice;
                department.all(function(data) {
                    //console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        choiceArray.push(data[i].id_department + " Name: " + data[i].name_department);
                    }
                    inquirer
                    .prompt([
                        {
                            message: "List of departments, choose an option to Update or Remove",
                            type: "list",
                            name: "choice", 
                            choices: choiceArray
                        }
                        
                    ]).then (function(answer){

                        var value = (answer.choice).split(" Name: ");
                        var condition = value[0];
        
                        switch (toDo){
                            case "Update Department":
                                SetDepartment(condition);
                            break;

                            case "Remove Department":
                                department.delete("id_department = " + condition, async function(result) {
                                    if(result.affectedRows > 0){
                                        console.log(value[1] + " Department was delete successfully!");
                                        await promptUser();
                                    }
                                });
                                process.exit();
                            break;
                        }
                    })
                })
            break;
        }
    });
}

/******
Department Module actions:
    Add - Update
*******/
function SetDepartment(id){

    inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "Please, fill in the department name?",
        validate: function(value) {
           if (value.trim() == '' || value.length == 0){
               return false; }
           else {  
               return true; }
        }
      }
    ])
    .then(function(answer) {
        if(id == "0"){
            department.create(["name_department"], [answer.name], async function(result) {
                if(result.affectedRows > 0){
                    console.log("Department was added successfully! - id: " + result.insertId);
                    await promptUser();
                }
          });
        }
        else{
            var objColVals = { name_department : answer.name};
            var condition = "id_department = " + id;
          
            department.update(objColVals, condition, async function(result) {
                if(result.affectedRows > 0){
                    console.log("Department was altered successfully!");
                    await promptUser();
                }
            })
        }
    });
}

/****** 
Role Module all actions:
    Select - Add - Update - Remove
*******/
function promptRole(){
    // access database and show Roles
    inquirer
    .prompt([
        {
            type : "list",
            message : "What would you like to do in Role session?",
            choices : ["View all list of role",
                "Add Role",
                "Update Role",
                "Remove Role",
                "Return main menu"
            ],
            name: "userChoice" 
        }
    ]).then
    (function(option){
        switch (option.userChoice){
            case "Add Role":
                SetRole("0");
               
            break;

            case "View all list of role":
                // access database and show role
                 role.all(async function(data) {
                     console.table(data);
                     await promptUser()
                })    
            break;

            case "Return main menu":
                promptUser()
            break;
            
            case "Update Role":
            case "Remove Role":  
                var toDo = option.userChoice;
                var choiceArray = [];
                role.all(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        choiceArray.push(data[i].id_role + " Name: " + data[i].title);
                    }
                           
                    inquirer
                    .prompt([
                        {
                            message: "List of roles, choose an option to Update or Remove",
                            type: "list",
                            name: "choice", 
                            choices: choiceArray
                        }
                        
                    ]).then (function(answer){

                        var value = (answer.choice).split(" Name: ");
                        var condition = value[0];
        
                        switch (toDo){
                            case "Update Role":
                                SetRole(condition);
                            break;

                            case "Remove Role":
                                role.delete("id_role = " + condition, async function(result) {
                                    if(result.affectedRows > 0){
                                        console.log(value[1] + " Role was delete successfully!");
                                        await promptUser();
                                    }
                                });
                                //process.exit();
                            break;
                        }
                    })
                })
            break;
        }
    });
}

/******
Role Module actions:
    Add - Update
*******/
function SetRole(id){

    //GET DEPARTMENT DATA
    department.all(function(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            DepartmentArray.push(data[i].id_department + " Name: " + data[i].name_department);
        }
    });

    inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Please, fill in the role title?",
        validate: function(value) {
           if (value.trim() == '' || value.length == 0){
               return false; }
           else {  
               return true; }
        }
      },
      {
        name: "salary",
        type: "input",
        message: "Please, fill in the role salary?",
        validate: function(value) {
           if (!(parseInt(value)))
               return 'Provide a salary'; 
           else{  
                return true; }

        }
      },
      {
        message: "List of departments, choose an option below",
        type: "list",
        name: "department", 
        choices: DepartmentArray
      }
    ])
    .then(function(answer) {
      
        var value = (answer.department).split(" Name: ");         

        if(id == "0"){
            role.create(["title", "salary", "id_department"], [answer.title, answer.salary, value[0]], async function(result) {
                if(result.affectedRows > 0){
                    console.log("Role was added successfully! - id: " + result.insertId);
                    await promptUser();
                }
          });
        }
        else{
            var objColVals = { title : answer.title,
                            salary: answer.salary,
                            id_department: value[0]};

            var condition = "id_role = " + id;
          
            role.update(objColVals, condition, async function(result) {
                if(result.affectedRows > 0){
                    console.log("Role was altered successfully!");
                    await promptUser();
                }
            })
        }
    });
}

/****** 
Employee Module all actions:
    Select - Add - Update - Remove
*******/
function promptEmployee(){
    // access database and show Roles
    inquirer
    .prompt([
        {
            type : "list",
            message : "What would you like to do in Employee session?",
            choices : ["View all list of employee",
                "Add Employee",
                "Update Employee",
                "Remove Employee",
                "Return main menu"
            ],
            name: "userChoice" 
        }
    ]).then
    (function(option){
        switch (option.userChoice){
            case "Add Employee":
                SetEmployee("0");
               
            break;

            case "View all list of employee":
                // access database and show employee
                 employee.all(async function(data) {
                     console.table(data);
                     await promptUser()
                })    
            break;

            case "Return main menu":
                promptUser()
            break;
            
            case "Update Employee":
            case "Remove Employee":  
                var toDo = option.userChoice;
                var choiceArray = [];
                
                employee.all(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        choiceArray.push(data[i].id_employee + " Name: " + data[i].name);
                    }
                           
                    inquirer
                    .prompt([
                        {
                            message: "List of employee, choose an option to Update or Remove",
                            type: "list",
                            name: "choice", 
                            choices: choiceArray
                        }
                        
                    ]).then (function(answer){

                        var value = (answer.choice).split(" Name: ");
                        var condition = value[0];
        
                        switch (toDo){
                            case "Update Employee":
                                SetEmployee(condition);
                            break;

                            case "Remove Employee":
                                employee.delete("id_employee = " + condition, async function(result) {
                                    if(result.affectedRows > 0){
                                        console.log(value[1] + " Employee was delete successfully!");
                                        await promptUser();
                                    }
                                });
                                process.exit();
                            break;
                        }
                    })
                })
            break;
        }
    });
}

/******
Employee Module actions:
    Add - Update
*******/
function SetEmployee(id){

    //GET ROLE DATA
    role.all(function(data) {
        for (var i = 0; i < data.length; i++) {
            RoleArray.push(data[i].id_role + " Name: " + data[i].title );
        }
    });

    //GET MANAGER DATA
    employee.manager(function(data) {
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            ManagerEmployee.push(data[i].id_employee + " Name: " + data[i].name +  " Role: " + data[i].title);
        }
        ManagerEmployee.push("None");
    });

    inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "What is the employee first name?",
        validate: function(value) {
           if (value.trim() == '' || value.length == 0){
               return false; }
           else {  
               return true; }
        }
      },
      {
        name: "lastname",
        type: "input",
        message: "What is the employees last name?",
        validate: function(value) {
           if (value.trim() == '' || value.length == 0){
               return false; }
           else {  
               return true; }
        }
      },
      {
        message: "List of roles, choose an option below",
        type: "list",
        name: "role", 
        choices: RoleArray
      },
      {
        message: "What is the employees manager's ID?",
        type: "list",
        name: "managerId",
        choices: ManagerEmployee
      }
    ])
    .then(function(answer) {
       
        var value = (answer.role).split(" Name: "); 
        
        // set manageid with ID selected
        var manageId = null;
        if(answer.managerId  != "None"){
            var getId = (answer.managerId).split(" Name: ");
            console.log(getId[0])
            manageId = getId[0];
        }  

        // id == 0 then INSERT else UPDATE
        if(id == "0"){
            employee.create(["first_name", "last_name", "id_manager", "id_role"], [answer.firstname, answer.lastname, manageId, value[0]], async function(result) {
                if(result.affectedRows > 0){
                    console.log("Employee was added successfully! - id: " + result.insertId);
                    await promptUser();
                }
          });
        }
        else{
            var objColVals = { first_name : answer.firstname,
                            last_name: answer.lastname,
                            id_manager: manageId,
                            id_role : value[0]
                            };

            var condition = "id_employee = " + id;
          
            employee.update(objColVals, condition, async function(result) {
                if(result.affectedRows > 0){
                    console.log("Employee was altered successfully!");
                    await promptUser();
                }
            })
        }
    });
}

title();
 
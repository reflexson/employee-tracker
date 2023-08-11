// Dependencies
const inquirer = require("inquirer")
const mysql = require("mysql2")
const cTable = require('console.table');
require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db'
  });


// Connection
connection.connect(function(err) {
    if (err) throw err
    console.log("Connected")
    console.log(`
    ╔═══╗─────╔╗──────────────╔═╗╔═╗
    ║╔══╝─────║║──────────────║║╚╝║║
    ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
    ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
    ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
    ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
    ───────║║──────╔═╝║─────────────────────╔═╝║
    ───────╚╝──────╚══╝─────────────────────╚══╝`)
    startPrompt();
});
// Initial Prompt
function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              "View All Departments", 
              "View All Roles",
              "View All Employees", 
              "Add a Department",
              "Add a Role",
              "Add an Employee",
              "Update an Employee Role"
            ]
    }
]).then(function(val) {
        switch (val.choice) {
            case "View All Employees":
              viewAllEmployees();
            break;
    
          case "View All Roles":
              viewAllRoles();
            break;
          case "View All Departments":
              viewAllDepartments();
            break;
          
          case "Add an Employee":
                addEmployee();
              break;

          case "Update an Employee Role":
                updateEmployee();
              break;
      
            case "Add a Role":
                addRole();
              break;
      
            case "Add a Department":
                addDepartment();
              break;
    
            }
    })
}
// View All Employees
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(e.first_name, ' ' ,e.last_name) AS manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;", 
    function(err, res) {
      if (err) throw err
      console.table(res)
      startPrompt()
  })
}
// View All Roles
function viewAllRoles() {
  connection.query("SELECT role.title,  department.name AS department, role.salary from role INNER JOIN department ON role.department_id=department.id;", 
  function(err, res) {
  if (err) throw err
  console.table(res)
  startPrompt()
  })
}
// View All Departments
function viewAllDepartments() {
  connection.query("SELECT department.id, department.name AS Department FROM department;", 
  function(err, res) {
    if (err) throw err
    console.table(res)
    startPrompt()
  })
}

// Select Role
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}
// Select Manage
var managersArr = [];
function selectManager() {
  connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name + ' ' + res[i].last_name);
    }

  })
  return managersArr;
}
// Add Employee
function addEmployee() { 
    inquirer.prompt([
        {
          name: "firstName",
          type: "input",
          message: "Enter their first name "
        },
        {
          name: "lastName",
          type: "input",
          message: "Enter their last name "
        },
        {
          name: "role",
          type: "list",
          message: "What is their role? ",
          choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function (val) {
      var roleId = selectRole().indexOf(val.role) + 1
      var managerId = selectManager().indexOf(val.choice) + 1
      connection.query("INSERT INTO employee SET ?", 
      {
          first_name: val.firstName,
          last_name: val.lastName,
          manager_id: managerId,
          role_id: roleId
          
      }, function(err){
          if (err) throw err
          console.table(val)
          startPrompt()
      })

  })
}
// Update Employee Role
  function updateEmployee() {
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
     if (err) throw err
     console.log(res)
    inquirer.prompt([
          {
            name: "name",
            type: "rawlist",
            choices: function() {
              var empName = [];
              for (var i = 0; i < res.length; i++) {
                empName.push(res[i].first_name + ' ' + res[i].last_name);
              }
              return empName;
            },
            message: "What is the Employee's name? ",
          },
          {
            name: "role",
            type: "rawlist",
            message: "What is the Employee's new title? ",
            choices: selectRole()
          }
          
      ]).then(function(val) {
        var roleId = selectRole().indexOf(val.role) + 1
        var employeeId = res.find(employee => employee.first_name + ' ' + employee.last_name === val.name)
        console.log(roleId, employeeId.id)
        connection.query("UPDATE employee SET role_id = ? WHERE id = ?", 
      
        [ roleId, employeeId.id],
        function(err){
            if (err) throw err
            console.table(val)
            startPrompt()
        })
  
    });
  });

  }
//   "UPDATE employee SET role_id = ?, SET stuff WHERE id = ?",


// Add Role
function addRole() { 
  connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role",   function(err, res) {
    inquirer.prompt([
        {
          name: "Title",
          type: "input",
          message: "What is the roles Title?"
        },
        {
          name: "Salary",
          type: "input",
          message: "What is the Salary?"

        } 
    ]).then(function(res) {
        connection.query(
            "INSERT INTO role SET ?",
            {
              title: res.Title,
              salary: res.Salary,
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )

    });
  });
  }
// Add Department
function addDepartment() { 

    inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "What Department would you like to add?"
        }
    ]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ",
            {
              name: res.name
            
            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
  }

  

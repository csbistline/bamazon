// ===================================
// REQUIRED FILES AND GLOBAL VARIABLES
// ===================================

var mysql = require('mysql');
var inquirer = require("inquirer");
var Table = require('cli-table');
var divider = "\n================================================================\n"

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// ===================================
// FUNCTIONS
// ===================================

// begins the fun
function start() {
    inquirer.prompt([
        {
            name: "option",
            type: "rawlist",
            message: "Choose a manager function:",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"]
        }
    ]).then(function (answers) {
        switch (answers.option) {
            case "View Product Sales by Department":
                showSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            case "Quit":
                console.log("Logging off...");
                connection.end();
                process.exit();
                break;
            default:
                break;
        }
    })
};


// create new department
function createDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "New department name:"

        },
        {
            name: "overhead_costs",
            type: "input",
            message: "Department overhead costs:"
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        connection.query({
            sql: 'UPDATE departments SET ?',
            values: [
                {
                    department_name: answers.department_name,
                    overhead_costs: answers.overhead_costs
                }
            ]
        }, function (error, results, fields) {
            if (err) throw err;
            // show departments table
            
        });
    })
}
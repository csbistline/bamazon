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
            choices: ["View products", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        }
    ]).then(function (answers) {
        switch (answers.option) {
            case "View products":
                showProducts();
                break;
            case "View Low Inventory":
                showLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProduct();
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

// shows available products
function showProducts() {
    console.log("\nItems in inventory");
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products",
        function (err, results) {
            if (err) throw err;
            // create table structure
            var table = new Table({
                head: ['id', 'Product', 'Department', 'Price', 'Quantity']
                , colWidths: [5, 65, 20, 10, 10]
            });
            // loop results and populate table
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                table.push(
                    [item.id, item.product_name, item.department_name, "$" + item.price, item.stock_quantity]
                );
            };
            // display results
            console.log(table.toString());
            console.log(divider);
            start();
        });
};

function showLowInventory() {
    console.log("\nItems with low inventory");
    connection.query("SELECT id, product_name, department_name, price, stock_quantity FROM products",
        function (err, results) {
            if (err) throw err;
            // create table structure
            var table = new Table({
                head: ['id', 'Product', 'Department', 'Price', 'Quantity']
                , colWidths: [5, 65, 20, 10, 10]
            });
            // loop results and populate table
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                if (item.stock_quantity <= 10) {
                    table.push(
                        [item.id, item.product_name, item.department_name, "$" + item.price, item.stock_quantity]
                    );
                }
            };
            // display results
            console.log(table.toString());
            console.log(divider);
            start();
        });
}

function addInventory() {
    console.log("\nAdd items to inventory");
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Select the id of a product you'd like to add to inventory: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter new quantity: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        connection.query(
            "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
            [
                answers.quantity,
                answers.id
            ],
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " items updated in database!\n");
                console.log(divider);
                showProducts()
            }
        )
    })
}

function addNewProduct() {
    console.log("\nAdd a new product to inventory");
    inquirer.prompt([
        {
            name: "product_name",
            type: "input",
            message: "Product name:"
        },
        {
            name: "department_name",
            type: "input",
            message: "Product department:"
        },
        {
            name: "price",
            type: "input",
            message: "Price:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answers) {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_quantity: answers.quantity
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product added!");
                showProducts();
            })
    })
};
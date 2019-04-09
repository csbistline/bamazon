// ===================================
// REQUIRED FILES AND GLOBAL VARIABLES
// ===================================

var mysql = require('mysql');
var inquirer = require("inquirer");
var Table = require('cli-table');

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
            name: "buy",
            type: "confirm",
            message: "Hi, would you like to buy something from BAmazon.com?"
        }
    ]).then(function(answers) {
        if (answers.buy) {
            showProducts();
        } else {
            console.log("Thank you for shopping at BAmazon.com!");
            connection.end();
            process.exit();
        };
    });
};

// displays list of available products
function showProducts(){
    console.log("\nItems for sale on BAmazon.com");
    connection.query("SELECT id, product_name, department_name, price FROM products",
        function (err, results) {
            if (err) throw err;
            // create table structure
            var table = new Table({
                head: ['id', 'Product', 'Department', 'Price']
                , colWidths: [5, 65, 20, 10]
            });
            // loop results and populate table
            for (var i = 0; i < results.length; i++) {
                var item = results[i];
                table.push(
                    [item.id, item.product_name, item.department_name, "$" + item.price]
                );
            };
            // display results
            console.log(table.toString());
            // hand off to purchase function
            purchaseProduct();
        });
};

// purchases the product
function purchaseProduct() {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Select the id of a product you'd like to purchase: ",
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
            message: "Enter quantity: ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (answers) {
            connection.query("SELECT * FROM products WHERE id=?",
                [answers.item],
                function (err, results) {
                    if (err) throw err;
                    // compare quantity requested to stock
                    if (results[0].stock_quantity < answers.quantity) {
                        // if not enough, error message
                        console.log("\nInsufficient quantity!");
                        purchaseProduct();
                    } else {
                        var totalPrice = results[0].price * answers.quantity;
                        var newQuantity = results[0].stock_quantity - answers.quantity;
                        // show the shopper his receipt
                        console.log("\nYour purchase:");
                        // create table structure
                        var table = new Table({
                            head: ['Product', 'Quantity', 'Total Price']
                            , colWidths: [65, 10, 15]
                        });
                        table.push(
                            [results[0].product_name, answers.quantity, "$" + totalPrice]
                        );
                        console.log(table.toString());
                        // update database with new totals and sales
                        updateProducts(results[0].id, totalPrice, newQuantity)
                    };
                });
        });
};

// updates database with purchase
function updateProducts(id, price, quantity) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: quantity,
                product_sales: price
            },
            {
                id: id
            }
        ],
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " items updated in database!\n");
            start();
        }
    )
};
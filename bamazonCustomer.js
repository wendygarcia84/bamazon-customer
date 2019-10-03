// Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
var mysql      = require('mysql');
var inquirer = require("inquirer");
var colors = require('colors');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'bamazon'
});
 
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id: ", connection.threadId);
    getStarted();
});

function getStarted() {
    connection.query('SELECT product_id, product_name, price, stock_quantity, product_sales FROM bamazon_products', function (error, results) {
        if (error) throw error;
        console.table(results);
      
    inquirer.prompt([
        {
            type: 'input',
            name: "id",
            message: 'Please enter the id of the item you want to purchase',
            //VERIFY THIS
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            type: "input",
            name: "quantity",
            message: "How many units?"
        }
    ]).then(function (answers) {
        for(var i = 0; i < results.length; i++) {
            if(parseInt(results[i].product_id) === parseInt(answers.id)) {
                makePurchase(answers.id, answers.quantity);
                return;
            }
        }
        console.log("The product doesn't exist, please enter a valid ID.".bold.red);
        getStarted();
        
    })
});
}

function makePurchase(id, quantity) {
    connection.query("SELECT * FROM bamazon_products WHERE ?", 
        {
            product_id: id
        }, function(err, res) {
            if (err) throw err;
            if (res[0].stock_quantity < quantity) {
                console.log("Not enough products".bold.yellow);
                getStarted();
            } else {
                var newQuantity = res[0].stock_quantity - quantity;
                var total = (quantity*res[0].price).toFixed(2);
                console.log("Your total is $".bold.bgWhite.blue, total);
                var sales = res[0].product_sales + total;
                updateProduct(id, newQuantity, sales);
            }
        })
}

function updateProduct(id, quantity, total_sales) {
    connection.query('UPDATE bamazon_products SET ? WHERE ?', 
    [{
        stock_quantity: quantity
    },
    {
        product_id: id
    }], function(err, res) {
        if (err) throw err;
        console.log("stock updated")
        getStarted();
    });
    //THIS PART WAS WORKING THIS EVENING AND THEN IT STOPPED WORKING FOR NO REASON!


    // connection.query('UPDATE bamazon_products SET ? WHERE ?', 
    // [{
    //     product_sales: total_sales
    // },
    // {
    //     product_id: id
    // }], function(err, res) {
    //     if (err) throw err;
    //     console.log("Purchase was succesful! Product updated.".bold.bgBlue.white);
    //     getStarted();
    // });
}
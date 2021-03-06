var inquirer = require("inquirer");
var mysql = require("mysql");
var colors = require('colors');

const {table} = require('table');

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
      connection.query('SELECT * FROM bamazon_products', function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                message: "Please select your option from the list below: ",
                name: "option",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
            }
        ]).then(function (user) {
            if (user.option === "View Products for Sale") 
              viewProducts(res);
            if (user.option === 'View Low Inventory') 
              viewLowInventory(res);
            if (user.option === "Add to Inventory")
              addToInventory(res);
            if(user.option === "Add New Product")
              addNewProduct();
            if (user.option === "EXIT")
                connection.end();
        })
      }) 
  }

  //=================//

function viewProducts(data) {
    //console.log("THIS WILL LIST ALL PRODUCTS");
    console.table(data);
    getStarted();
}

function viewLowInventory(data) {
    //console.log("This will list all objects with inventory lower than 5");
    var values = [["ID".bgWhite.black, "NAME".bgWhite.black, "QUANTITY".bgWhite.black]];
    //console.log(data);
    for(var obj of data) {
        if (obj.stock_quantity < 5)
        values.push([obj.product_id, obj.product_name, String(obj.stock_quantity).red.bold])
    }
    output = table(values);
    console.log(output);
    getStarted();
}

function addToInventory(data) {
    //new query
    
        //console.log("This will add more products to the inventory");
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Enter the id of the Item to update",
                validate: function(value) {
                    if (isNaN(value) === false) {
                      return true;
                    }
                    return false;
                  }
            }, {
                type: "input",
                name: "quantity",
                message: "Type quantity to add: "
            }
        ]).then(function (user) {
            for(var i = 0; i < data.length; i++) {
                if(parseInt(data[i].product_id) === parseInt(user.id)) {
                    makeUpdate(user.id, user.quantity);
                    return;
                }
            }
            console.log("The product doesn't exist, please enter a valid ID.".bold.red);
            getStarted();
        })
}

function makeUpdate(userId, userQuantity) {
    connection.query('SELECT * FROM bamazon_products WHERE ?',
    {
        product_id: userId 
    }, function (error, results) {
        if (error) throw error;

        var newQuantity = parseInt(results[0].stock_quantity) + parseInt(userQuantity);

        connection.query('UPDATE bamazon_products SET ? WHERE ?',
        [{
            stock_quantity: newQuantity
        },
        {
            product_id: userId
        }], function(err, res) {
            if (err) throw err;
            console.log("Product updated.".bgBlue.bold.white);
            getStarted();
        })
    })
}
function addNewProduct() {
    //console.log("This will add a new product");
    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Enter the name of the product: "
        }, {
            type: "input",
            name: "department_name",
            message: "Enter department: "
        }, {
            type: "input",
            name: "price",
            message: "Enter Price: "
        }, {
            type: "input",
            name: "stock_quantity",
            message: "Enter quantity: "
        }
    ]).then(function (user) {
        connection.query('INSERT INTO bamazon_products SET ?', {
            product_name: user.product_name,
            department_name: user.department_name,
            price: user.price,
            stock_quantity: user.stock_quantity,
            product_sales: 0
        }, function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n".bgBlue.bold.white);
            getStarted();
        })
        
    })
    
}


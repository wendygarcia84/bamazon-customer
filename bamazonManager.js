var inquirer = require("inquirer");
var mysql = require("mysql");

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
                name: "option",
                choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"]
            }
        ]).then(function (user) {
            if (user.option === "View Products for Sale") 
              viewProducts(res);
            if (user.option === 'View Low Inventory') 
              viewLowInventory(res);
            if (user.option === "Add to Inventory")
              addToInventory();
            if(user.option === "Add New Product")
              addNewProduct();
            if (user.option === "EXIT")
                connection.end();
        })
      }) 
  }

  //=================//

function viewProducts(data) {
    console.log("THIS WILL LIST ALL PRODUCTS");
    console.table(data);
    getStarted();
}

function viewLowInventory(data) {
    console.log("This will list all objects with inventory lower than 5");
    //console.log(data);
    for(var obj of data) {
        if (obj.stock_quantity < 5)
        console.log
        (`Id: ${obj.product_id}     |   Item: ${obj.product_name}       |       Stock Quantity: ${obj.stock_quantity}`)
    }
    getStarted();
}

function addToInventory() {
    //new query
    
        console.log("This will add more products to the inventory");
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Enter the id of the Item to update"
            }, {
                type: "input",
                name: "quantity",
                message: "Type quantity to add: "
            }
        ]).then(function (user) {
            connection.query('SELECT * FROM bamazon_products WHERE ?',
            {
                product_id: user.id
            }, function (error, results) {
                if (error) throw error;

                var newQuantity = parseInt(results[0].stock_quantity) + parseInt(user.quantity);

                connection.query('UPDATE bamazon_products SET ? WHERE ?',
                [{
                    stock_quantity: newQuantity
                },
                {
                    product_id: user.id
                }], function(err, res) {
                    if (err) throw err;
                    console.log("Product updated.");
                    getStarted();
                })
        })
        })
}

function addNewProduct() {
    console.log("This will add a new product");
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
            stock_quantity: user.stock_quantity
        }, function(err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " product inserted!\n");
            getStarted();
        })
        
    })
    
}
# Bamazon app

## Customer Level

The app will take in orders from customers and deplete stock from the store's inventory.

* DATABASE: bamazon

CREATE TABLE bamazon_products (
	product_id INT (30) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR (50),
    department_name VARCHAR (50),
    price FLOAT (30, 2),
    stock_quantity INT (30)
);

Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

Then create a Node application called bamazonCustomer.js. 

Running this application will 

* first display all of the items available for sale. Include the ids, names, and prices of products for sale.

* The app should then prompt users with two messages.

1. The first should ask them the ID of the product they would like to buy.
2. The second message should ask how many units of the product they would like to buy.

Once the customer has placed the order, your application should

* check if your store has enough of the product to meet the customer's request.

 - If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

 - However, if your store does have enough of the product, you should fulfill the customer's order.

    * This means updating the SQL database to reflect the remaining quantity.
    * Once the update goes through, show the customer the total cost of their purchase.

## Level 2

Create a new Node application called bamazonManager.js. Running this application will:


* List a set of menu options:

   - View Products for Sale
   - View Low Inventory
   - Add to Inventory
   - Add New Product

1. If a manager selects View Products for Sale, the app should list every available item: 

    - the item IDs, 
    - names, 
    - prices, and 
    - quantities.

2. If a manager selects View Low Inventory, then it should 
    - list all items with an inventory count lower than five.

3. If a manager selects Add to Inventory, your app should 
    - display a prompt that will let the manager "add more" of any item currently in the store.

4. If a manager selects Add New Product, it should allow the manager to 
    - add a completely new product to the store.

## Level 3
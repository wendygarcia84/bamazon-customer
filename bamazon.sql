DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE bamazon_products (
	product_id INT (30) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR (50),
    department_name VARCHAR (50),
    price FLOAT (30, 2),
    stock_quantity INT (30)
);

INSERT INTO bamazon_products (product_name, department_name, price, stock_quantity)
VALUE
("wedding ring", "Jewelry", 980.98, 3),
("turquoise earings", "Jewelry", 34.65, 10),
("diapers", "Baby", 12.34, 35),
("baby wipes", "Baby", 7.34, 9),
("teddy bear", "Baby", 5.26, 2),
("beach sandals", "Shoes", 12.67, 4),
("snickers", "Shoes", 37.43, 2),
("dog food", "Pets", 9.45, 5),
("fish tank", "Pets", 27.94, 1),
("crate", "Pets", 29.99, 4);
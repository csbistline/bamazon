DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMEL(10,2),
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("LEGO Holiday Easter Egg Hunt Building Kit", "Toys & Games", 9.99, 102);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Crayola Scribble Scrubbie, Toy Pet Playset", "Toys & Games", 24.93, 18);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Fire TV Stick 4K with Alexa Voice Remote", "Electronics", 49.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot (3rd Gen)", "Electronics", 49.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kindle Paperwhite", "Electronics", 129.99, 1000);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("$10 PlayStation Store Gift Card", "Video Games", 10, 809);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Borderlands Game of the Year Edition", "Video Games", 7.50, 200);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Where the Crawdads Sing", "Books", 15.60, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Becoming", "Books", 13.89, 201);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dickies Men's Multi-Pack Dri-Tech Moisture Control Crew Socks", "Clothing", 25.99, 4);

DROP DATABASE IF EXISTS employeetracker_db;
CREATE DATABASE employeetracker_db; 

USE employeetracker_db

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id),
    REFERENCES department(id),
    ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    mangerid INT NULL,
    FOREIGN KEY (role_id),
    REFERENCES role(id)
);


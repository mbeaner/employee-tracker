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
    CONSTRAINT FK_depart FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    CONSTRAINT FK_roles FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT FK_manager FOREIGN KEY (manager_id) REFERENCES employee(id)
);


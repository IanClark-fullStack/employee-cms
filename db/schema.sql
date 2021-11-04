DROP DATABASE IF EXISTS company_db; 
CREATE DATABASE company_db;

USE company_db;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    department_name VARCHAR(30)
);

DROP TABLE IF EXISTS job_role;
CREATE TABLE job_role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(30),
    salary INT NOT NULL, 
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id), 
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager_id INT,
    role_id INT, 
    FOREIGN KEY (role_id) REFERENCES job_role(id)
);
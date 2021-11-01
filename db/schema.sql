DROP DATABASE IF EXISTS company_db; 
CREATE DATABASE company_db;

USE company_db;


CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    department_name VARCHAR(30)
    /* PRIMARY KEY (id) */
);


CREATE TABLE job_role (
    id INT NOT NULL AUTO_INCREMENT, 
    title VARCHAR(30),
    salary DECIMAL NOT NULL, 
    PRIMARY KEY (id),
    department_id INT, 
    FOREIGN KEY (department_id) REFERENCES department(id)
    
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id), 
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT, 
    FOREIGN KEY (role_id) REFERENCES job_role(id)
);
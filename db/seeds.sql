USE company_db;

INSERT INTO department (department_name)
VALUES ('Engineer');

INSERT INTO department (department_name)
VALUES ('Designer');

INSERT INTO department (department_name) 
VALUES ('Sales');


INSERT INTO job_role (title, salary, department_id)
VALUES ('Full Stack Software Engineer', 120000, 1);

INSERT INTO job_role (title, salary, department_id)
VALUES ('Mid-Level Designer', 73000, 2);

INSERT INTO job_role (title, salary, department_id)
VALUES ('Client Manager', 130000, 3);


INSERT INTO employee (first_name, last_name, role_id) 
VALUES ('Bryce', 'Merriam', 1);
INSERT INTO employee (first_name, last_name, role_id) 
VALUES ('Gwen', 'Gertrude', 3);
INSERT INTO employee (first_name, last_name, role_id) 
VALUES ('CoCo', 'Reals', 2);





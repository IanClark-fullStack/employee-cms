const db = require('./db/connection.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const cTable = require('console.table');
const { title } = require('process');

// Inquirer Questions 
const startUpOptions = [
    {
        name: 'View all employees',
        value: 'VIEW_EMPLOYEES'
    },
    {
        name: 'View all departments',
        value: 'VIEW_DEPARTMENTS'
    },
    {
        name: 'View all roles',
        value: 'VIEW_ROLES'
    },
    {
        name: 'Add an employee',
        value: 'ADD_EMPLOYEE'
    },
    {
        name: 'Add a department',
        value: 'ADD_DEPARTMENT'
    },
    {
        name: 'Add role',
        value: 'ADD_ROLE'
    },
    {
        name: 'Update an employee role',
        value: 'UPDATE_ROLE'
    },
    {
        name: 'View Employees by Department',
        value: 'VIEW_BY_DEPT'
    },
    {
        name: 'Quit',
        value: 'QUIT'
    }
];
const startPrompt = [
    {
        type: 'list',
        name: 'startUpData',
        choices: startUpOptions,
        message: 'Would what you like to do?'
    }
];
const init = () => {
    console.log(chalk.greenBright.underline.bold('*******************************************'));
    console.log(chalk.greenBright.underline.bold('                                           '));
    console.log(chalk.greenBright.underline.bold('             EMPLOYEE MANAGER              '));
    console.log(chalk.greenBright.underline.bold('                                           '));
    console.log(chalk.greenBright.underline.bold('                                           '));
    console.log(chalk.greenBright.underline.bold('                                           '));
    console.log(chalk.greenBright.underline.bold('*******************************************\n\n\n'));
    sendStartUp();
}
const sendStartUp = () => {
    inquirer.prompt(startPrompt)
    .then(({ startUpData }) => {
        switch (startUpData) {
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'VIEW_EMPLOYEES':
                viewEmployees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'ADD_ROLE': 
                addRole();
                break;
            case 'UPDATE_ROLE':
                updateRole();
                break;
            case 'UPDATE_EMPLOYEE':
                updateEmployee();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;  
            case 'VIEW_BY_DEPT':
                viewEmployeesByDepartment();
                break;
            case 'REMOVE_ROLES':
                removeRole();
                break;
            case 'End':
                db.end();
                break;
        }
    })
}
// **************** View ALl Employees *** READ All, SELECT employee TABLE (ALL VALUES), job_role TABLE (job_role.title), department TABLE (department_name) FROM employee, job_role and department ORDER BY emoployee.id  
const viewEmployees = () => {
    console.log(chalk.green.underline.bold('*****  A L L  E M P L O Y E E S  *****\n'));

    const query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, employee.manager_id, job_role.title, job_role.salary, department.department_name AS department 
    FROM employee LEFT JOIN job_role ON employee.role_id = job_role.id LEFT JOIN department ON job_role.department_id = department.id`;

    db.query(query, (err, res) => {
        if (err) { console.log(err); }
            console.table(res);
            sendStartUp(); 
    });
};
const viewEmployeesByDepartment = () => {
    console.log(chalk.green.underline.bold('*****  A L L  E M P L O Y E E S  B Y  D E P A R T M E N T S  *****\n'));
    const query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, job_role.title, job_role.salary, department.department_name AS department 
    FROM employee JOIN job_role ON employee.role_id = job_role.id LEFT JOIN department ON job_role.department_id = department.id`;

    db.query(query, (err, res) => {
        if (err) { console.log(err); }
            console.table(res);
            sendStartUp(); 
    });
};
// **************** VIEW ALL DEPARTMENTs *** READ All, select * from
const viewDepartments = () => {
    db.query(`SELECT department.id, department.department_name FROM department;`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(chalk.green.underline.bold('*****  A L L  D E P A R T M E N T S  *****\n'))
            console.table(res);
           sendStartUp();
        }
    })
}
// **************** ROLES Functionality *** View, Add and Update
const viewRoles = () => {
    db.query(`SELECT job_role.id, job_role.title, department.department_name AS 'department', job_role.salary FROM job_role INNER JOIN department ON job_role.department_id = department.id;`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(chalk.green.underline.bold('*****  A L L  R O L E S  *****\n'));
            console.table(res);
            sendStartUp();
        }
    })
}
// **************** ADD Employee  *** READ All, INSERT INTO
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter employee first name'
        },
        {
            type: 'input', 
            name: 'last_name', 
            message: 'Enter employee last name'
        }
    ])
    .then(nameInfo => {
        const findRoles = `SELECT job_role.id, job_role.title FROM job_role`;
        db.query(findRoles, (err, res) => {
            if (err) { console.log(err); }
            const roles = res.map(({id, title}) => ({name: title, value: id}));
            console.log(roles);
            inquirer.prompt([
                {
                    'type': 'list',
                    'name': 'role',
                    'message': 'Select the employees job role',
                    'choices': roles
                },
                {
                    'type': 'input', 
                    'name': 'mgmt',
                    'message': 'What is the Manager ID?'
                }
            ])
            .then(selectedRole => {
                const nameArray = [nameInfo.first_name, nameInfo.last_name, selectedRole.mgmt, selectedRole.role];
                console.log(nameArray);
                const qry = `INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)`;
                db.query(qry, nameArray, (err, res) => {
                    if (err) { console.log(err); }
                    console.log(chalk.green.underline.bold('*****  E M P L O Y E E  C R E A T E D  *****\n'));
                    sendStartUp();
                })
            })
        })
    })
}
// ************************** ADD ROLE ***********************
const addRole = () => {
    // Grab the current Departments 
    let dptData = [];
    const dptSql = `SELECT department_name, id FROM department`;
    // Read into departments 
    db.query(dptSql, (err, res) => {
        if (err) {console.log(err);}
        dptData = res.map(({department_name, id}) => ({ name: department_name, value: id }));
        inquirer.prompt([
            {
                'type': 'input',
                'name': 'newRoleName',
                'message': 'Enter the name of the new role to add'
            }, 
            {
                'type': 'input',
                'name': 'newRoleSalary', 
                'message': 'Enter the salary for the new role'
            },
            {
                'type': 'list',
                'name': 'selectedDepartment',
                'message': 'Select the department the new role belongs to',
                'choices': dptData
            }
        ])
        .then((newRoleData) => {
            // Build an array with User Inputs and Selection Values Captured
            const roleParams = [newRoleData.newRoleName, newRoleData.newRoleSalary, newRoleData.selectedDepartment];
            // Build a query to INSERT INTO the roles table, 
            const insertRole = `INSERT INTO job_role (title, salary, department_id) VALUES (?, ?, ?)`;
            db.query(insertRole, roleParams, (err, res) => {
                if (err) {console.log(err);}
                console.log((chalk.green.underline.bold('*****  N E W  R O L E  C R E A T E D  *****\n')); 
                sendStartUp();
            })
    
        })
    })
    
}
// ************************** ADD DEPARTMENT ***********************
const addDepartment = () => {
    inquirer.prompt([
        {
            'type': 'input',
            'name': 'newDpt', 
            'message': 'Enter the name of the new Department'
        }
    ])
    .then((departmentInfo) => {
        const qry = `INSERT INTO department (department_name) VALUES (?)`;
        db.query(qry, departmentInfo.newDpt, (err, res) => {
            if (err) { console.log(err); }
            console.log(chalk.green.underline.bold('*****  D E P A R T M E N T  A D D E D *****\n'));
            sendStartUp();
        })
    });
};
// Send the prompt to add a dpt name 
// Then, grab the captured name 
// INSERT INTO 
// Log success 

// ************************** UPDATE EMPLOYEE ROLE --- VERSION 2 ***********************
const updateRole = () => {
    // Grab all the employees 
     const empQuery = `SELECT first_name, last_name, id FROM employee`;
    db.query(empQuery, (err, res) => {
        if(err){console.log(err) }
        console.log(res);
        // Build Object Structure {First Last: ID}
        const employeesObj = res.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        console.log(employeesObj);
        inquirer.prompt([
            {
                'type': 'list',
                'name': 'selectedEmployee',
                'message': 'Select the employee you wish to update',
                'choices': employeesObj
            },
          
        ])
        .then((employeeChoiceData) => {
            // Get all roles from job_role table 
            const roleQry = `SELECT * FROM job_role`;
            db.query(roleQry, (err, res) => {
                if (err) console.log(err);
                const roleObj = res.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        'type': 'list', 
                        'name': 'selectedRole', 
                        'message': 'Select the role for this employee',
                        'choices': roleObj
                    }
                ])
                .then((newRole) => {
                    const roleData = newRole.selectedRole;
                    const newRoleParams = [roleData, employeeChoiceData.selectedEmployee];

                    const updateQry = `UPDATE employee SET role_id = ? WHERE id = ?`;
                    db.query(updateQry, newRoleParams, (err, res) => {
                        if (err) { console.log(err); }
                        console.log(chalk.green.underline.bold('*****  U P D A T E D  E M P L O Y E E  R O L E *****\n'));
                        console.log(res);
                        sendStartUp();
                    });
                });
            });
        });
    });
};
init();
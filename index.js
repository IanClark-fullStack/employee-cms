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
        value: 'UPDATE_EMPLOYEE_ROLE'
    },
    {
        name: 'Update employee manger',
        value: 'UPDATE_EMPLOYEE_MANAGER'
    },
    {
        name: 'Remove employee',
        value: 'REMOVE_EMPLOYEE'
    },
    {
        name: 'Remove role',
        value: 'REMOVE_ROLE'
    },
    {
        name: 'Remove department',
        value: 'REMOVE_DEPARTMENT'
    },
    {
        name: 'Quit',
        value: 'QUIT'
    }
];
// Departments Array 
let departmentList = [];


const startPrompt = [
    {
        type: 'list',
        name: 'startUpData',
        choices: startUpOptions,
        message: 'Would what you like to do?'
    }
];

const departmentAdd = [
    {
        type: 'input',
        name: 'newDepartmentName',
        message: 'Enter department name'
    }
];


const employeeAdd = [
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter employee first name'
    },
    {
        type: 'input', 
        name: 'last_name', 
        message: 'Enter employee last name'
    }, 
    {
        type: 'list', 
        name: 'newEmployeeRole',
        choices: ['Build', 'Array', 'From', 'Departments DB'], 
        message: 'Select the role for the new employee.'
    },
    {
        type: 'input',
        name: 'newEmployeeManager',
        message: 'Enter the manager name for the employee'
    }
];
const employeeUpdate = [
    {
        type: 'list',
        name: 'selectEmployee',
        choices: ['Build', 'Array', 'From', 'Employees DB'], 
        message: 'Select the employee you would like to update'
    },
    {
        type: 'list',
        name: 'updateRole',
        choices: ['Build', 'Array', 'From', 'Employee Role DB'], 
        message: 'Choose the new role for this employee'
    }
];

const init = () => {
    console.log('***********************************');
    console.log('*                                 *');
    console.log('*        EMPLOYEE MANAGER         *');
    console.log('*     _______________________     *');
    console.log('*                                 *');
    console.log('***********************************');
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
            case 'ADD_DEPARTMENT':
                addDepartment();
                break;
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
                break;
            case 'ADD_ROLE': 
                addRole();
                break;
            case 'ADD_ROLE':
                addEmployee();
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
            case 'REMOVE_ROLES':
                removeRole();
                break;
            case 'End':
                db.end();
                break;
        }
    })
}

// **************** View Departments *** READ All, select * from
const viewEmployees = () => {
    console.log(chalk.blue.underline.bold('*****  A L L  D E P A R T M E N T S  *****\n'));
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) { console.log(err); }
        else { 
            console.table(res);
            sendStartUp(); 
        }
       
    })
};
const updateEmployee = () => {
    db.query(`SELECT employee.id, first_name, last_name FROM employee;`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            const employee = res.map(employee => ({name: employee.first_name + ' ' + employee.last_name, value: employee.id}));
            
            db.query(`SELECT job_role.id, job_role.title FROM job_role;`, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    const role = res.map(role => ({name: job_role.title, value: job_role.id}));

                    prompt([
                        {
                            type: 'list',
                            name: 'employee',
                            message: 'Select the employee',
                            choices: employee
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'Select the new role',
                            choices: role
                        }
                    ])

                    .then(res => {
                        db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [res.role, res.employee], (err, res) => {
                            if (err) {
                                console.log(err);
                            } else {
                                sendStartUp();
                            }
                        })
                    })
                }
            })
        }
    })
};


// **************** ADD Departments *** INSERT INTO department SET name
const viewDepartments = () => {
    db.query(`SELECT department.id, department.department_name FROM department;`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
           sendStartUp();
        }
    })

}


const addDepartment = () => {
    inquirer.prompt(departmentAdd)
    .then((departmentData) => {
        // Save the response
        const departmentToAdd = departmentData.newDepartmentName;
        // Push the New Department to an Array to feed into choices 
        departmentList.push(departmentToAdd);
        // Insert INTO Deparment Table
        db.query(`INSERT INTO department(department_name) SET ?`, departmentData.department_name, (err, res) => {
            if (err) { console.log(err); }
            else { sendStartUp(); }  
        })
    });
}

const removeDepartment = () => {
    db.query(`SELECT department.id, department.department_name FROM department;`, (err, res) => {
        if (err) {console.log(err);}
        else {
            const foundDepartmentName = res.map(department => ({name: department.department_name, value: department.id}));
            inquirer.prompt([
                {
                    type: 'list', 
                    name: 'department',
                    message: 'Select department to delete',
                    coices: foundDepartmentName
                }
            ])

            .then(res => {
                db.query(`DELETE FROM department WHERE id = ?`, res.department, (err, res) => {
                    if (err) { console.log(err); }
                    else {
                        sendStartUp();
                    }
                })
            })
        }
    })
}



// **************** ROLES Functionality *** View, Add and Update
const viewRoles = () => {
    db.query(`SELECT job_role.id, job_role.title, department.department_name AS 'department', job_role.salary FROM job_role INNER JOIN department ON job_role.department_id = department.id;`, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.table(res);
            sendStartUp();
        }
    })
}
const addRole = () => {
    db.query(`SELECT department.id, department.department_name FROM department;`,(err, res) => {
        if (err) { console.log(err); }
        else {
            const foundDepartments = res.map(depaerment => ({name: department.department_name, value: department.id }));

            inquirer.prompt([
                {
                    name: 'title',
                    message: 'Type the new role'
                },
                {
                    name: 'salary',
                    message: 'Enter the salary for this role',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Select the approriate department for this role',
                    choices: foundDepartments
                }
            ])
            .then(res => {
                db.query('INSERT INTO job_role(title, salary, department_id) VALUE (?, ?, ?)', [res.title, res.salary, res.department], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        sendStartUp();
                    }
                })
            })
        }
    })
};

            
        
    
    
    



    // Make the Query Promise
   


// **************** View All Employees *** READ All, select * from







init();
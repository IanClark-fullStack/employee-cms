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
            case 'ADD_EMPLOYEE':
                addEmployee();
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

// **************** View ALl Employees *** READ All, SELECT employee TABLE (ALL VALUES), job_role TABLE (job_role.title), department TABLE (department_name) FROM employee, job_role and department ORDER BY emoployee.id  
const viewEmployees = () => {
    console.log(chalk.blue.underline.bold('*****  A L L  E M P L O Y E E S  *****\n'));

    const query = `SELECT employee.id, 
    employee.first_name, 
    employee.last_name, employee.manager_id, job_role.title, job_role.salary, department.department_name AS department 
    FROM employee LEFT JOIN job_role ON employee.role_id = job_role.id LEFT JOIN department ON job_role.department_id = department.id`;

    db.query(query, (err, res) => {
        if (err) { console.log(err); }
        
            console.table(res);
            // sendStartUp(); 
        
       
    });
};
// **************** VIEW ALL DEPARTMENTs *** READ All, select * from
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
        }, 
       
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
                const nameArray = [nameInfo.first_name, nameInfo.last_name, selectedRole.manager_id, selectedRole.role_id];
                const qry = `INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)`;
                db.query(qry, nameArray, (err, res) => {
                    if (err) { console.log(err); }
                    console.log(`Employee Created`);
                    console.log(res);
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
        console.log(dptData);

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
                console.log('New role created'); 
                sendStartUp();
            })
    
        })
    })
    // const roles = res.map(({id, title}) => ({name: title, value: id}));
    
}


// ************************** LEFT TO DO *****************************************
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
            console.log('Added new department');
            sendStartUp();
        })
    });
};
// Send the prompt to add a dpt name 
// Then, grab the captured name 
// INSERT INTO 
// Log success 



// ************************** UPDATE EMPLOYEE ROLE ***********************
const updateRole = () => {
    // Grab all the employees 
    const empQuery = `SELECT * FROM employee`;
    db.query(`SELECT * FROM employee`, (errs, data) => {
        if(errs){ console.log(errs) }
        // Build Object Structure {First Last: ID}
        const employeesObj = data.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        inquirer.prompt([
            {
                'type': 'list',
                'name': 'selectedEmployee',
                'message': 'Select the employee you wish to update',
                'choices': employeesObj
            }
        ])
        // We now have an array to choose from, so
        
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
                        console.log('Employee Role has been updated');
                        sendStartUp();
                    });
                });
            });
        });
        
    });
};
// **************** VIEW Employees By DEPARTMENT *** READ All, select * from
// Folder 22- Prepared Statements


// **************** ADD Departments *** INSERT INTO department SET name

// const addDepartment = () => {
//     inquirer.prompt(departmentAdd)
//     .then((departmentData) => {
//         // Save the response
//         const departmentToAdd = departmentData.newDepartmentName;
//         // Push the New Department to an Array to feed into choices 
//         departmentList.push(departmentToAdd);
//         // Insert INTO Deparment Table
//         db.query(`INSERT INTO department(department_name) SET ?`, departmentData.department_name, (err, res) => {
//             if (err) { console.log(err); }
//             else { sendStartUp(); }  
//         })
//     });
// }





// **************** REMOVE Department *** 
// const removeDepartment = () => {
//     db.query(`SELECT department.id, department.department_name FROM department;`, (err, res) => {
//         if (err) {console.log(err);}
//         else {
//             const foundDepartmentName = res.map(department => ({name: department.department_name, value: department.id}));
//             inquirer.prompt([
//                 {
//                     type: 'list', 
//                     name: 'department',
//                     message: 'Select department to delete',
//                     coices: foundDepartmentName
//                 }
//             ])

//             .then(res => {
//                 db.query(`DELETE FROM department WHERE id = ?`, res.department, (err, res) => {
//                     if (err) { console.log(err); }
//                     else {
//                         sendStartUp();
//                     }
//                 })
//             })
//         }
//     })
// }



// **************** ADD a ROLE *** INSERT INTO job_role TABLE
// const addRole = () => {
//     db.query(`SELECT department.id, department.department_name FROM department;`,(err, res) => {
//         if (err) { console.log(err); }
//         else {
//             const foundDepartments = res.map(depaerment => ({name: department.department_name, value: department.id }));

//             inquirer.prompt([
//                 {
//                     name: 'title',
//                     message: 'Type the new role'
//                 },
//                 {
//                     name: 'salary',
//                     message: 'Enter the salary for this role',
//                 },
//                 {
//                     type: 'list',
//                     name: 'department',
//                     message: 'Select the approriate department for this role',
//                     choices: foundDepartments
//                 }
//             ])
//             .then(res => {
//                 db.query('INSERT INTO job_role(title, salary, department_id) VALUE (?, ?, ?)', [res.title, res.salary, res.department], (err, res) => {
//                     if (err) {
//                         console.log(err);
//                     } else {
//                         sendStartUp();
//                     }
//                 })
//             })
//         }
//     })
// };





init();
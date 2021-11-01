const db = require('./db/connection.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const cTable = require('console.table');

// Inquirer Questions 
const startUpOptions = ['View all departments', 'View all employees', 'Add a department', 'Add a role', 'Add an employee','Update an emplyoee role'];

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

const roleAdd = [
    {
        type: 'input',
        name: 'newRoleName',
        message: 'Role to add'
    },
    {
        type: 'number',
        name: 'newRoleSalary',
        message: 'Enter the salary amount for this role'
    },
    {
        type: 'checkbox',
        name: 'newRoleDepartment',
        choices: ['Build', 'Array', 'From', 'Departments DB'], 
        message: 'Select the Department for this role'
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
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role': 
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateRole();
                break;
        }
    })
}

// **************** View Departments *** READ All, select * from
const viewDepartments = () => {
    console.log(chalk.blue.underline.bold('*****  A L L  D E P A R T M E N T S  *****\n'));
    db.query(`SELECT department.id AS ID, department.department_name AS Department FROM department`, (err, rows) => {
        if (err) { console.log(err); }
        else { console.table(rows);
            sendStartUp(); }
       
    })
}

// **************** ADD Departments *** READ All, select * from
const addDepartment = () => {
    inquirer.prompt(departmentAdd)
    .then((departmentData) => {
        // Save the response
        const departmentToAdd = departmentData.newDepartmentName;
        // Insert INTO Deparment
        db.query('INSERT INTO department SET ?', { department_name: departmentToAdd }, (err, result) => {
            if (err) { console.log(err); }
            
        }),
        console.table(departmentToAdd);
        sendStartUp();
        
    });
        
    
    

}


    // Make the Query Promise
   


// **************** View All Employees *** READ All, select * from







init();
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql';
import util from 'util';
import inquirer from 'inquirer';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    startApp();
});

function startApp() {
    inquirer
        .prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        })
        .then((answer) => {
            switch (answer.action) {
                case 'View all departments':
                    viewAllDepartments();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case 'View all employees':
                    viewAllEmployees();
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
                    updateEmployeeRole();
                    break;
                case 'Exit':
                    connection.end();
                    console.log('Goodbye!');
                    break;
            }
        });
}

function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewAllRoles() {
    connection.query('SELECT * FROM rol', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res);
        startApp();
    });
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        })
        .then((answer) => {
            connection.query(
                'INSERT INTO department (name) VALUES (?)',
                [answer.departmentName],
                (err, res) => {
                    if (err) throw err;
                    console.log('Department added!');
                    startApp();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the Salary:'
            },
            {
                type: 'input',
                name: 'departmentName', // Modify to departmentName
                message: 'Enter the department name:'
            }
        ])
        .then((answers) => {
            // Check if the department with the given name exists
            connection.query(
                'SELECT id FROM department WHERE name = ?',
                [answers.departmentName],
                (err, result) => {
                    if (err) throw err;

                    if (result.length === 0) {
                        // Department not found, handle accordingly
                        console.log('Error: Department not found');
                        startApp();
                    } else {
                        // Department found, insert the role
                        const departmentId = result[0].id;
                        connection.query(
                            'INSERT INTO rol (title, salary, department_id) VALUES (?, ?, ?)',
                            [answers.roleName, answers.salary, departmentId],
                            (err, res) => {
                                if (err) throw err;
                                console.log('Role added!');
                                startApp();
                            }
                        );
                    }
                }
            );
        });
}


// Update addEmployee function
function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeFirstName',
                message: 'Enter the first name of the employee:'
            },
            {
                type: 'input',
                name: 'employeeLastName',
                message: 'Enter the last name of the employee:'
            },
            {
                type: 'input',
                name: 'roleName',
                message: 'Enter the role name of the employee:'
            },
            {
                type: 'input',
                name: 'managerId',
                message: 'Enter the manager ID of the employee (if applicable):'
            }
        ])
        .then((answers) => {
            // Check if the role with the given name exists
            connection.query(
                'SELECT id FROM rol WHERE title = ?',
                [answers.roleName],
                (err, result) => {
                    if (err) throw err;

                    if (result.length === 0) {
                        // Role not found, handle accordingly
                        console.log('Error: Role not found');
                        startApp();
                    } else {
                        // Role found, insert the employee
                        const roleId = result[0].id;

                        // Validate managerId
                        const managerId = parseInt(answers.managerId) || null;

                        connection.query(
                            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                            [
                                answers.employeeFirstName,
                                answers.employeeLastName,
                                roleId,
                                managerId,
                            ],
                            (err, res) => {
                                if (err) throw err;
                                console.log('Employee added!');
                                startApp();
                            }
                        );
                    }
                }
            );
        });
}


function updateEmployeeRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'employeeId',
                message: 'Enter the ID of the employee you want to update:'
            },
            {
                type: 'input',
                name: 'newRoleId',
                message: 'Enter the new role ID for the employee:'
            }
        ])
        .then((answers) => {
            connection.query(
                'UPDATE employee SET role_id = ? WHERE id = ?',
                [answers.newRoleId, answers.employeeId],
                (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated!');
                    startApp();
                }
            );
        });
}

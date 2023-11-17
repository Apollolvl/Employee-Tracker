require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

// Access environment variables
const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;
const port = process.env.DB_PORT;

// Create a MySQL connection
const connection = mysql.createConnection({
    host,
    user,
    password,
    database,
    port
});

const query = util.promisify(connection.query).bind(connection);

async function main() {
    try {
        // Connect to JawsDB database
        await query('SELECT 1');

        // Insert a new department
        await query("INSERT INTO Departments (DepartmentName) VALUES ('IT')");

        // Retrieve departments
        const departments = await query('SELECT * FROM Departments');
        console.log('Departments:', departments);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        connection.end();
    }
}

main();

USE vsc7kjbne3yszzwb;

-- Drop the tables if they exist (this will remove existing tables)
DROP TABLE IF EXISTS department, rol, employee, employee_role_history;

-- Create the department table
CREATE TABLE IF NOT EXISTS department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create the rol table
CREATE TABLE IF NOT EXISTS rol (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create the employee table
CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    hire_date DATE NOT NULL,
    role_id INT,
    manager_id INT,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES rol(id),
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Create a table to store employee roles history
CREATE TABLE IF NOT EXISTS employee_role_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    old_role_id INT,
    new_role_id INT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_id FOREIGN KEY (employee_id) REFERENCES employee(id),
    CONSTRAINT fk_old_role_id FOREIGN KEY (old_role_id) REFERENCES rol(id),
    CONSTRAINT fk_new_role_id FOREIGN KEY (new_role_id) REFERENCES rol(id)
);

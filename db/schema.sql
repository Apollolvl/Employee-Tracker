USE vsc7kjbne3yszzwb;

CREATE TABLE Departments (
   DepartmentID INT PRIMARY KEY AUTO_INCREMENT,
   DepartmentName VARCHAR(50) NOT NULL
);

CREATE TABLE Positions (
   PositionID INT PRIMARY KEY AUTO_INCREMENT,
   PositionName VARCHAR(50) NOT NULL
);

CREATE TABLE Employees (
   EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
   FirstName VARCHAR(50) NOT NULL,
   LastName VARCHAR(50) NOT NULL,
   Email VARCHAR(100) UNIQUE NOT NULL,
   PhoneNumber VARCHAR(15),
   HireDate DATE,
   DepartmentID INT,
   PositionID INT,
   FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID),
   FOREIGN KEY (PositionID) REFERENCES Positions(PositionID)
);

CREATE TABLE EmployeeRoles (
   EmployeeID INT,
   PositionID INT,
   StartDate DATE,
   EndDate DATE,
   PRIMARY KEY (EmployeeID, PositionID),
   FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
   FOREIGN KEY (PositionID) REFERENCES Positions(PositionID)
);


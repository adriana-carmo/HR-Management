DROP DATABASE IF EXISTS human_resources_DB;

CREATE DATABASE human_resources_DB;

USE human_resources_DB;

CREATE TABLE department (
  id_department INT NOT NULL AUTO_INCREMENT,
  name_department VARCHAR(50) NULL,
  PRIMARY KEY (id_department)
);

CREATE TABLE role (
  id_role INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(40) NOT NULL,
  salary DECIMAL(10,2) DEFAULT 0,
  id_department INT NOT NULL,
  PRIMARY KEY (id_role),
  CONSTRAINT FK_role_depart FOREIGN KEY (id_department)
  REFERENCES department(id_department)
);

CREATE TABLE employee (
  id_employee INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30)  NULL,
  id_manager INT NULL,
  id_role INT NOT NULL,
  PRIMARY KEY (id_employee),
  CONSTRAINT FK_employee_role FOREIGN KEY (id_role)
  REFERENCES role(id_role)
);


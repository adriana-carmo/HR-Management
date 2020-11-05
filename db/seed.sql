
USE human_resources_DB;

-- Insert department table
insert into department (name_department) values ("Financial");
insert into department (name_department) values ("Law office");
insert into department (name_department) values ("Customer Service");


-- Insert role table
insert into role (title, salary, id_department) values ("financial manager", 55000.00, 1);
insert into role (title, salary, id_department) values ("lawyer",60000.00, 2);


-- Insert employee table
insert into employee (first_name, last_name, id_manager, id_role)
values ("Sarah", "Apple", null, 1);

insert into employee (first_name, last_name, id_manager, id_role)
values ("Mary", "Brown", 1, 1);

insert into employee (first_name, last_name, id_manager, id_role)
values ("Jhon", "Smith", null, 2);

insert into employee (first_name, last_name, id_manager, id_role)
values ("Steve", "Tree", 2, 2);
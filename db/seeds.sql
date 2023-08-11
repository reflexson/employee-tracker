INSERT INTO department(name)
VALUES  ('Sales'),
        ('Legal'),
        ('Finance'),
        ('Engineering');

INSERT INTO role(title, salary, department_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 4),
        ('Software Engineer', 120000, 4),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 2),
        ('Lawyer', 190000, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ('Johnny', 'Goodvibes', 1, null),
        ('Bert', 'Smoothtalker', 2, 1),
        ('Lisa', 'Mathwiz', 3, null),
        ('Hubert', 'Codeguy', 4, 3),
        ('Marla', 'Overlord', 5, null),
        ('Donna', 'Numbers', 6, 5),
        ('Frank', 'Badvibes', 7, null),
        ('Brenda', 'Souless', 8, 7);
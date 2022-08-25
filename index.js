const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Password1',
    database: 'employeetracker_db'
});

db.connect((err) => {
    if (err) throw err;

    startPrompt();
});

const startPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View All Employees',
                    value: 'view_employees'
                },
                {
                    name: 'Add Employee',
                    value: 'add_employee'
                },
                {
                    name: 'Update Employee Role',
                    value: 'update_employee_role'
                },
                {
                    name: 'View All Roles',
                    value: 'view_roles'
                },
                {
                    name: 'Add Role',
                    value: 'add_role'
                },
                {
                    name: 'View all Departments',
                    value: 'view_departments'
                },
                {
                    name: 'Add Department',
                    value: 'add_department'
                },
                {
                    name: 'Quit',
                    value: 'quit'
                }
            ]
        }
    ]).then(res => {
        var choice = res.choice;

        switch (choice) {
            case 'view_employees':
                viewAllEmployees();
                break;
            case 'add_employee':
                addEmployee();
                break;
            case 'update_employee_role':
                updateRole();
                break;
            case 'view_roles':
                viewRoles();
                break;
            case 'add_role':
                addRole();
                break;
            case 'view_departments':
                viewAllDepartments();
                break;
            case 'add_department':
                addDepartment();
                break;
            default:
                quit();
        }
    });
}

const viewAllEmployees = () => {
    db.query("SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager From employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;",
    (err, res) => {
        if (err) throw err;

        console.table(res);

        startPrompt();
    })
}

const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'firstname',
            type: 'input',
            message: "What is the employee's first name?"
        },
        {
            name: 'lastname',
            type: 'input',
            message: "What is the employee's last name?"
        },
        {
            name: 'role',
            type: 'list',
            message: "What is the employee's role?",
            choices: selectRole()
        },
        {
            name: 'manager',
            type: 'list',
            message: "Who is the employee's manager?",
            choices: selectManager()
        }
    ]).then((res) => {
        let roleId = selectRole().indexOf(res.role) + 1;
        let managerId 
        if (res.manager === null) {
            managerId = null
        } else {
            managerId = selectManager().indexOf(res.manager) + 1;
        }
        db.query('INSERT INTO employee SET ?',
        {
            first_name: res.firstname,
            last_name: res.lastname,
            role_id: roleId,
            manager_id: managerId
        },
        (err, res) => {
            if (err) throw err;
            
            startPrompt();
        })
        console.table(`Added ${res.firstname} ${res.lastname} to the database`);
    })
} 

const roleArray = [];
const selectRole = () => {
    db.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
    return roleArray;
}

const managerArray = [];
const selectManager = () => {
    db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
        if (err) throw err;

        for(var i = 0; i < res.length; i++) {
            managerArray.push(res[i].first_name + ' ' + res[i].last_name);
        }
        managerArray.unshift({name: 'None', value: null});
    })
    return managerArray;
}

const updateRole = () => {
    db.query("SELECT employee.first_name, employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
    (err, res) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'name',
                type: 'list',
                message: "Which employee's role do you want to update?",
                choices: () => {
                    let employeeArr = [];
                    for(var i = 0; i < res.length; i++) {
                        employeeArr.push(`${res[i].first_name} ${res[i].last_name}`);
                    } 
                    return employeeArr
                }
            },
            {
                name: "role",
                type: "list",
                message: "Which role do you want to assign the selected employee",
                choices: selectRole()
            }
        ]).then((val) => {
            var nameArr = val.name.split(" ");
            var roleId = selectRole().indexOf(val.role) + 1;
            db.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
            [
                roleId,
                nameArr[0],
                nameArr[1]
            ],
            (err) => {
                if (err) throw err;
                console.log("Updated employee's role.");
                startPrompt();
            })
        });
    });
}

const viewRoles = () => {
    db.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;",
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
    })
}

const addRole = () => {
    inquirer.prompt([
        {
            name: 'role',
            type: 'input',
            message: "What is the name of the role?"
        },
        {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of the role?'
        },
        {
            name: 'department',
            type: 'list',
            message: "Which department does the role belong to?",
            choices: selectDepartment()
        }
    ]).then((res) => {
        var departmentId = selectDepartment().indexOf(res.department) + 1;
        db.query("INSERT INTO role SET ?",
        {
            title: res.role,
            salary: res.salary,
            department_id: departmentId
        },
        (err,res) => {
            if (err) throw err;
            startPrompt();
        })
        console.log(`Added ${res.role} to the database`)
    });
}

const departmentArr = []
const selectDepartment = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            departmentArr.push(res[i].name);
        }
    })
    return departmentArr;
}

const viewAllDepartments = () => {
    db.query("SELECT department.id, department.name FROM department;",
    (err, res) => {
        if (err) throw err;
        console.table(res);
        startPrompt();
    })
}

const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: "What is the name of the department?"
        }
    ]).then((res) => {
        db.query("INSERT INTO department SET ?",
        {
            name: res.name
        },
        (err, res) => {
            if (err) throw err;
            
            startPrompt();
        })
        console.log(`Added ${res.name} to the database`)
    })
}

const quit = () => {
    process.exit();
}
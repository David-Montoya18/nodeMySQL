const conn = require('./dbconnection/dbconnect');
const http = require('http');
const fs = require('fs');
const port = 4000;

conn.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL DB');
});

http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/index.html').pipe(res);
    } 
    else if (url === '/adddept'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/adddept.html').pipe(res);
    } 
    else if (url === '/listdept'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/listdept.html').pipe(res);
    } 
    else if (url === '/addemp'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/addemp.html').pipe(res);
    } 
    else if (url === '/listemp'){
        res.writeHead(200, {'content-type': 'text/html'})
        fs.createReadStream('public/listemp.html').pipe(res);
    }
    else if(url == '/listdepartments') {
        listDepartments(req, res);
    }
    else if(url == '/updateDepartment') {
        updateDepartment(req, res);
    }
    else if(url == '/deleteDepartment') {
        deleteDepartment(req, res);
    }
    else if(url == '/saveDepartment') {
        saveDepartment(req, res);
    }
    else if(url == '/listemployees') {
        listemployees(req, res);
    }
    else if(url == '/updateEmployee') {
        updateEmployee(req, res);
    }
    else if(url == '/deleteEmployee') {
        deleteEmployee(req, res);
    }
    else if(url == '/saveEmployee') {
        saveEmployee(req, res);
    }
    else{
        let stream = fs.createReadStream(__dirname + '/public' + url);
        stream.on('err', ()=>{
            fs.createReadStream('resource not found').pipe(res)
        })
        stream.pipe(res)
    }
}).listen(port);

let listDepartments = (req, res) => {
    let cmd = 'SELECT * FROM departments';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, {'content-type': 'json'});
        res.write(JSON.stringify(result));
        res.end();
    });    
}

let updateDepartment = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let department = new URLSearchParams(data);
        let form = Object.fromEntries(department);
        let id = form.departmentID;
        delete form['departmentID'];
        let cmd = 'UPDATE departments SET ? WHERE departmentID = ?';
        conn.query(cmd, [form, id], (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/listdept'})
            res.end(); 
        });
    });
}

let deleteDepartment = (req, res) => {
    let params = req.url.split('?')[1];
    let parsedParams = new URLSearchParams(params);
    let id = parsedParams.get('id');
    let cmd = 'DELETE FROM departments WHERE departmentID = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(302, {'location': '/listdept'});
        res.end();
    });
}

let saveDepartment = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let departments = new URLSearchParams(data);
        let form = Object.fromEntries(departments);
        let cmd = 'INSERT INTO departments SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/adddept'});
            res.end(); 
        });
    });
}

let listemployees = (req, res) => {
    let cmd = 'SELECT employees.*, departments.* FROM employees INNER JOIN departments on employees.departmentID = departments.departmentID';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, {'content-type': 'json'});
        res.write(JSON.stringify(result));
        res.end();
    });    
}

let updateEmployee = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let employees = new URLSearchParams(data);
        let form = Object.fromEntries(employees);
        let id = form.employeeID;
        delete form['employeeID'];
        let cmd = 'UPDATE employees SET ? WHERE employeeID = ?';
        conn.query(cmd, [form, id], (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/listemp'})
            res.end(); 
        });
    });
}

let deleteEmployee = (req, res) => {
    let params = req.url.split('?')[1];
    let parsedParams = new URLSearchParams(params);
    let id = parsedParams.get('id');
    let cmd = 'DELETE FROM employees WHERE employeeID = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(302, {'location': '/listemp'});
        res.end();
    });
}

let saveEmployee = (req, res) => {
    let data = '';
    req.on('data', chunks => {
        data += chunks;
    });
    req.on('end', () => {
        let employees = new URLSearchParams(data);
        let form = Object.fromEntries(employees);
        // form.departmentID = parseInt(form.departmentID);
        let cmd = 'INSERT INTO employees SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, {'location': '/addemp'});
            res.end(); 
        });
    });
}
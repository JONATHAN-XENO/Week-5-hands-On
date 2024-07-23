const express = require ('express')
const app = express ();
const mysql = require ('mysql2');
const cors = require ('cors');
const bcrypt = require ('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


app.use(express.json())
app.use(cors())
dotenv.config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

db.connect ((err) => {
    if (err) return console.log("Error connrcting to mysql")
    console.log ("Connected to mysql: ", db.threadId);

    db.query(`CREATE DATABASE IF NOT EXISTS expense_tracker`, (err, 
        result) => {
        if (err) return console.log (err)

        console.log ("Database expense_tracker created/checked")

    db.changeUser ({database: 'expense_tracker'} , (err) => {
        if (err) return console.log (err)
        console.log("changed to expense_tracker")

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL UNIQUE,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL
    )
   `;

   db.query (createUsersTable, (err, result) => {
       if (err) return console.log(err)

       console.log ("Users table check/created")
      })
    })
  })
})

app.get('', (req,res) =>{
    res.send ("Hello world this is my server")
})

app.post ('/api/register' , async (req, res) => {
    try{
        const users = `SELECT * FROM users WHERE email = ?`

        db.query (users, [req.body.email], (err, data) => {
            if(data.length) return res.status(409).json("User already exists")

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(req.body.password, salt)

            const newUser = `INSERT INTO users (email, username, password) VALUES (?)`
            value = [
                req.body.email,
                req.body.username,
                hashedPassword
            ] 

            db.query(newUser, [value], (err, data) => {
                if(err) res.status(500).json("Something went wrong")
    
                return res.status(200).json("User has been created successfully")
                })
        })

      

    } catch (err) {
        res.status(500).json("Internal server error")
    }
})

app.post('/api/login' , async(req, res) => {
    try {
        const users = `SELECT * FROM users WHERE email = ?`
        db.query(users, [req.body.email], (err, data) => {
            if(data.length === 0) return res.status(404).json("User not found")
            const isPasswordValid = bcrypt.compareSync(req.body.password, data[0].password)

            if(!isPasswordValid) return res.status(400).json("Invalid email or password")

            return res.status(200).json("Login successful")
        })

    }

    catch (err) {
        res.status(500).json("Internal Server error")
    }
})

app.post('/expenses', (req, res) => {
    const { name, amount, date, category } = req.body;
    const expense = { user_id: req.user.userId, name, amount, date, category };
    const sql = 'INSERT INTO expenses SET ?';
    db.query(sql, expense, (err, result) => {
        if (err) throw err;
        res.send('Expense added');
    });
});

app.get('/expenses', (req, res) => {
    const sql = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(sql, [req.user.userId], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.listen (3000, () => {
    console.log ("server running on port 3000")
})


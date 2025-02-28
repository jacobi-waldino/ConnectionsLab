const path = require('path');
const mysql = require('mysql2/promise');
const express = require('express');
console.log(__dirname);
require('dotenv').config();

const app = express();

app.use(express.static(__dirname));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USR,
    password: process.env.DB_PW,
    database: process.env.DB_DF,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

// Get games from code
app.get("/getgame/:code", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM games WHERE code = ?", [req.params.code]);
        res.json(result);
    } catch (err) {
        console.error("Database query error:", err);
        res.status(500).send("Database query failed");
    }
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});

// Start the server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});

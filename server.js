const path = require('path');
const mysql = require('mysql2/promise');
const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

app.use(express.static(path.join(__dirname)));

// This will create a new pool for each request
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

// Route to get game by code
app.get("/getgame/:code", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query("SELECT * FROM games WHERE code = ?", [req.params.code]);
        res.json(rows);
    } catch (err) {
        console.error("Could not fetch game:", err);
        res.status(500).send("Database query failed");
    } finally {
        connection.release();
    }
});

// Route to save game
app.get("/savegame/:code/:g10/:g11/:g12/:g13/:g14/:g20/:g21/:g22/:g23/:g24/:g30/:g31/:g32/:g33/:g34/:g40/:g41/:g42/:g43/:g44", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.query("INSERT INTO games VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                req.params.code, req.params.g10, req.params.g11, req.params.g12, req.params.g13, req.params.g14,
                req.params.g20, req.params.g21, req.params.g22, req.params.g23, req.params.g24,
                req.params.g30, req.params.g31, req.params.g32, req.params.g33, req.params.g34,
                req.params.g40, req.params.g41, req.params.g42, req.params.g43, req.params.g44
            ]
        );
        res.status(200).send("Game saved successfully");
    } catch (err) {
        console.error("Could not save game to database:", err);
        res.status(500).send("Database query failed");
    } finally {
        connection.release();
    }
});

// Route to get all codes
app.get("/getcodes/", async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query("SELECT code FROM games");
        res.json(rows);
    } catch (err) {
        console.error("Could not fetch code:", err);
        res.status(500).send("Database query failed");
    } finally {
        connection.release();
    }
});

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Export the serverless function correctly
module.exports = serverless(app);

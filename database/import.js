const mysql = require('mysql');
const fs = require('fs');
const readline = require('readline');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mozimusor'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to the database.');
});


const importData = ((filePath, mozi) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const data = line.split(';');
        const sql = `INSERT INTO ${mozi} (moziazon, mozinev, irszam, cim, telefon) VALUES (?, ?, ?)`;
        connection.query(sql, data, (err, result) => {
            if (err) throw err;
            console.log('Data inserted:', result.insertId);
        });
    });

    rl.on('close', () => {
        console.log(`Finished importing data from ${filePath}`);
        connection.end();
    });
})('mozi.txt', 'mozi');



(filePath, film) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const data = line.split(';');
        const sql = `INSERT INTO ${film} (fkod, filmcim, szines, szinkron, szarmazas, mufaj, hossz) VALUES (?, ?, ?)`;
        connection.query(sql, data, (err, result) => {
            if (err) throw err;
            console.log('Data inserted:', result.insertId);
        });
    });

    rl.on('close', () => {
        console.log(`Finished importing data from ${filePath}`);
        connection.end();
    });
};

((filePath, hely) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    rl.on('line', (line) => {
        const data = line.split(';');
        const sql = `INSERT INTO ${hely} (fkod, moziazon) VALUES (?, ?, ?)`;
        connection.query(sql, data, (err, result) => {
            if (err) throw err;
            console.log('Data inserted:', result.insertId);
        });
    });

    rl.on('close', () => {
        console.log(`Finished importing data from ${filePath}`);
        connection.end();
    });
})('hely.txt', 'hely');

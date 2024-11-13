const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/assets/css', express.static(path.join(__dirname, 'assets', 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets/js', express.static(path.join(__dirname, 'assets', 'js')));
app.use('/assets/webfonts', express.static(path.join(__dirname, 'assets', 'webfonts')));

const db = mysql.createConnection({
    host: '143.47.98.96',
    user: 'studb040',
    password: 'xyz456',
    database: 'db040'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID ' + db.threadId);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/uzenetek.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'uzenetek.html'));
});

// CRUD végpontok a film táblához

// Read - Lekérdezés a film táblából, három oszlopra korlátozva
app.get('/api/filmek', (req, res) => {
    const query = `
        SELECT film.filmcim AS FilmCim, film.szinkron AS Szinkron, film.mufaj AS Mufaj
        FROM film
        ORDER BY film.filmcim ASC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// Create - Új film hozzáadása
app.post('/api/filmek', (req, res) => {
    const { filmcim, szinkron, mufaj, szines, szarmazas, hossz } = req.body;
    const query = 'INSERT INTO film (filmcim, szinkron, mufaj, szines, szarmazas, hossz) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [filmcim, szinkron, mufaj, szines, szarmazas, hossz], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error saving data');
        } else {
            res.send('Film adatok sikeresen mentve');
        }
    });
});

// Update - Film adatok frissítése
app.put('/api/filmek/:id', (req, res) => {
    const { id } = req.params;
    const { filmcim, szinkron, mufaj, szines, szarmazas, hossz } = req.body;
    const query = 'UPDATE film SET filmcim = ?, szinkron = ?, mufaj = ?, szines = ?, szarmazas = ?, hossz = ? WHERE fkod = ?';
    db.query(query, [filmcim, szinkron, mufaj, szines, szarmazas, hossz, id], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error updating data');
        } else {
            res.send('Film adatok sikeresen frissítve');
        }
    });
});

// Delete - Film törlése
app.delete('/api/filmek/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM film WHERE fkod = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error deleting data');
        } else {
            res.send('Film sikeresen törölve');
        }
    });
});

const port = 8040;
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

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

app.get('/api/adatok', (req, res) => {
    const { katid, ertekid, nev } = req.query;
    let query = `
        SELECT allat.nev, allat.katid, allat.ertekid, allat.ev, mozi.nev AS mozi_nev, ertek.forint
        FROM allat
        JOIN mozi ON allat.katid = mozi.id
        JOIN ertek ON allat.ertekid = ertek.id
        WHERE 1=1
    `;
    const params = [];

    if (katid) {
        query += ' AND allat.katid = ?';
        params.push(katid);
    }

    if (ertekid) {
        query += ' AND allat.ertekid = ?';
        params.push(ertekid);
    }

    if (nev) {
        query += ' AND allat.nev LIKE ?';
        params.push(`%${nev}%`);
    }


    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

// CRUD végpontok az allat táblához

// Read
app.get('/api/allatok', (req, res) => {
    const query = `
        SELECT allat.id, allat.nev, mozi.nev AS mozi_nev, ertek.forint, allat.ev
        FROM allat
        JOIN mozi ON allat.katid = mozi.id
        JOIN ertek ON allat.ertekid = ertek.id
        ORDER BY allat.nev ASC
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

// Create
app.post('/api/allatok', (req, res) => {
    const { nev, katid, ertekid, ev } = req.body;
    const query = 'INSERT INTO allat (nev, katid, ertekid, ev) VALUES (?, ?, ?, ?)';
    db.query(query, [nev, katid, ertekid, ev], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error saving data');
        } else {
            res.send('Data saved successfully');
        }
    });
});

// Update
app.put('/api/allatok/:id', (req, res) => {
    const { id } = req.params;
    const { nev, katid, ertekid, ev } = req.body;
    const query = 'UPDATE allat SET nev = ?, katid = ?, ertekid = ?, ev = ? WHERE id = ?';
    db.query(query, [nev, katid, ertekid, ev, id], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error updating data');
        } else {
            res.send('Data updated successfully');
        }
    });
});

// Delete
app.delete('/api/allatok/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM allat WHERE id = ?';
    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error deleting data');
        } else {
            res.send('Data deleted successfully');
        }
    });
});

app.post('/kapcsolat', (req, res) => {
    const { name, email, message } = req.body;
    const query = 'INSERT INTO kapcsolat (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error saving data');
        } else {
            res.send('Data saved successfully');
        }
    });
});

app.get('/uzenetek', (req, res) => {
    const query = 'SELECT * FROM kapcsolat ORDER BY created_at DESC';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results);
        }
    });
});

const port = 8026;
app.listen(port, () => {
    console.log('Server is running at http://localhost:${port}');
});


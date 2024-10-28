const express = require('express');
const app = express();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

app.use(express.static(path.join(__dirname)));
app.use('/js', express.static('js', {
    setHeaders: (res, path) => {
        res.set('Content-Type', 'application/javascript');
    }
}));
app.use('/css', express.static('css'));
app.use(express.json());

const db = new sqlite3.Database('admins.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.get('/welcome.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'welcome.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/logs.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM admins WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            if (!row) {
                res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
                return;
            }
            res.json({ role: row.role });
        });
});

app.post('/api/admin/add', (req, res) => {
    const { username, password, role } = req.body;
    
    db.run('INSERT INTO admins (username, password, role) VALUES (?, ?, ?)',
        [username, password, role],
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({
                id: this.lastID,
                message: "Admin başarıyla eklendi"
            });
        });
});

app.delete('/api/admin/delete/:username', (req, res) => {
    const username = req.params.username;
    
    db.run('DELETE FROM admins WHERE username = ?',
        username,
        function(err) {
            if (err) {
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ message: "Admin başarıyla silindi" });
        });
});

app.get('/api/admin/list', (req, res) => {
    db.all('SELECT id, username, role, created_at FROM admins', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

const PORT = 5501;
app.listen(PORT, () => {
    console.log(`Server http://localhost:${PORT} adresinde çalışıyor! 🚀`);
    console.log(`Ana sayfa: http://localhost:${PORT}/welcome.html`);
    console.log(`Log sayfası: http://localhost:${PORT}/index.html`);
});

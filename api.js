const express = require('express');
const router = express.Router();
const db = require('./database');

router.post('/admin/add', (req, res) => {
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

router.delete('/admin/delete/:username', (req, res) => {
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

router.get('/admin/list', (req, res) => {
    db.all('SELECT id, username, role, created_at FROM admins', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

module.exports = router;

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'userdb',
});


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }else{
    console.log('Connected to MySQL database');
  }
});

// CRUD
// C
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO user (name, email) VALUES (?, ?)';
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Error creating user' });
      return;
    }
    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  });
});

// R
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM user';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: 'Error retrieving users' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/users/:id', (req, res) => { 
  const userId = req.params.id;
  const sql = 'SELECT * FROM user WHERE id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error retrieving user:', err);
      res.status(500).json({ error: 'Error retrieving user' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(results[0]);
    }
  });
});
// U
app.put('/users/:id', (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  const sql = 'UPDATE user SET name = ?, email = ? WHERE id = ?';
  db.query(sql, [name, email, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Error updating user' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});
// D
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM user WHERE id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Error deleting user' });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted successfully' });
    }
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
const router2 = require('express').Router();
const db2 = require('../db');

router2.post('/', async (req, res) => {
  const { title, genre } = req.body;
  const result = await db2.query(
    'INSERT INTO movies(title, genre) VALUES($1, $2) RETURNING *',
    [title, genre]
  );
  res.json(result.rows[0]);
});

router2.get('/', async (req, res) => {
  const result = await db2.query('SELECT * FROM movies');
  res.json(result.rows);
});

module.exports = router2;
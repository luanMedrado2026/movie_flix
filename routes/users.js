const router = require('express').Router();
const db = require('../db');

router.post('/', async (req, res) => {
  const { name } = req.body;
  const result = await db.query(
    'INSERT INTO users(name) VALUES($1) RETURNING *',
    [name]
  );
  res.json(result.rows[0]);
});

router.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM users');
  res.json(result.rows);
});

module.exports = router;

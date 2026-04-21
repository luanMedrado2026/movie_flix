const router3 = require('express').Router();
const db3 = require('../db');

router3.post('/', async (req, res) => {
  const { user_id, movie_id, rating } = req.body;
  const result = await db3.query(
    'INSERT INTO ratings(user_id, movie_id, rating) VALUES($1,$2,$3) RETURNING *',
    [user_id, movie_id, rating]
  );
  res.json(result.rows[0]);
});

router3.get('/top', async (req, res) => {
  const result = await db3.query(`
    SELECT m.title, AVG(r.rating) as avg_rating
    FROM ratings r
    JOIN movies m ON m.id = r.movie_id
    GROUP BY m.title
    ORDER BY avg_rating DESC
  `);
  res.json(result.rows);
});

module.exports = router3;      
const fs = require('fs');
const csv = require('csv-parser');
const client = require('./db');

async function getOrCreateDate(dateStr) {
  const result = await client.query(
    'SELECT date_id FROM dim_date WHERE full_date = $1',
    [dateStr]
  );

  if (result.rows.length > 0) {
    return result.rows[0].date_id;
  }

  const date = new Date(dateStr);

  const insert = await client.query(
    `INSERT INTO dim_date (full_date, year, month, day)
     VALUES ($1, $2, $3, $4)
     RETURNING date_id`,
    [
      dateStr,
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ]
  );

  return insert.rows[0].date_id;
}

async function loadRatings() {
  console.log('Carregando ratings...');

  const ratings = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('/data_lake/ratings.csv')
      .pipe(csv())
      .on('data', (data) => ratings.push(data))
      .on('end', async () => {
        try {
          for (const r of ratings) {
            const userId = parseInt(r.user_id);
            const rating = parseInt(r.rating);

            if (isNaN(userId) || isNaN(rating)) continue;

            const dateId = await getOrCreateDate(r.timestamp);

            await client.query(
              `INSERT INTO fact_ratings (user_id, movie_id, rating, date_id)
               VALUES ($1, $2, $3, $4)`,
              [userId, r.movie_id, rating, dateId]
            );
          }

          console.log('Ratings carregados!');
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

module.exports = loadRatings;
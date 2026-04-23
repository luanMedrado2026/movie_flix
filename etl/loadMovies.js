const fs = require('fs');
const csv = require('csv-parser');
const client = require('./db');

async function loadMovies() {
  console.log('Carregando filmes...');

  const movies = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('/data_lake/movies.csv')
      .pipe(csv())
      .on('data', (data) => movies.push(data))
      .on('end', async () => {
        try {
          for (const m of movies) {
            const year = parseInt(m.year);

            await client.query(
              `INSERT INTO dim_movies (movie_id, title, year, genre, director)
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (movie_id) DO NOTHING`,
              [
                m.movie_id,
                m.title,
                isNaN(year) ? null : year,
                m.genre,
                m.director
              ]
            );
          }

          console.log('Filmes carregados!');
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

module.exports = loadMovies;
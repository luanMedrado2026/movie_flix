const fs = require('fs');
const csv = require('csv-parser');
const client = require('./db');

async function loadUsers() {
  console.log('Carregando usuários...');

  const users = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream('/data_lake/users.csv')
      .pipe(csv())
      .on('data', (data) => users.push(data))
      .on('end', async () => {
        try {
          for (const u of users) {
            const userId = parseInt(u.user_id);

            if (isNaN(userId)) continue;

            await client.query(
              `INSERT INTO dim_users (user_id, name, email)
               VALUES ($1, $2, $3)
               ON CONFLICT (user_id) DO NOTHING`,
              [userId, u.name, u.email]
            );
          }

          console.log('Usuários carregados!');
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', reject);
  });
}

module.exports = loadUsers;
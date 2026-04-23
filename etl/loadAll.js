const client = require('./db');
const loadUsers = require('./loadUsers');
const loadMovies = require('./loadMovies');
const loadRatings = require('./loadRatings');

async function runETL() {
  try {
    await client.connect();

    console.log('Iniciando ETL...');

    await loadUsers();
    await loadMovies();
    await loadRatings();

    console.log('ETL finalizado com sucesso!');
    process.exit();
  } catch (err) {
    console.error('Erro no ETL:', err);
    process.exit(1);
  }
}

runETL();
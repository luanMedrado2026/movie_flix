const { Client } = require('pg');

const client = new Client({
  host: 'dw', // nome do serviço no docker-compose
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'movieflix_dw'
});

module.exports = client;
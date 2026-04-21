const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));
app.use('/ratings', require('./routes/ratings'));

app.get('/', (req, res) => {
  res.send('MovieFlix API rodando 🚀');
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
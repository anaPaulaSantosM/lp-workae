const express = require('express');
const path = require('path');
const cors = require('cors');
const waitlistRoutes = require('./src/routes/waitlist.routes');

const app = express();

// Servir arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(cors());
app.use(express.json());

app.use('/api/waitlist', waitlistRoutes);

// Rota principal para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;

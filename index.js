import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiUrl = process.env.API_URL;

app.get('/', (req, res) => {
  res.send('Servidor está funcionando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`API URL configurada: ${apiUrl}`);
});
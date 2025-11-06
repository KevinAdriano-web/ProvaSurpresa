import { adicionarRotas } from './rotas.js';

import express from 'express'
const api = express();

// CORS middleware
api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

api.use(express.json());

adicionarRotas(api);

api.listen(5010, () => console.log('..: API subiu com sucesso na porta 5010'))


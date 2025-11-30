// Carregar variáveis de ambiente ANTES de qualquer import
import dotenv from 'dotenv'
dotenv.config()

import { adicionarRotas } from './rotas.js';

import express from 'express'
import cors from 'cors'

const api = express();
// Configure CORS: use FRONTEND_URL if provided, otherwise allow all (dev)
const corsOptions = {}
if (process.env.FRONTEND_URL) {
	corsOptions.origin = process.env.FRONTEND_URL
	corsOptions.credentials = true
} else {
	corsOptions.origin = true
}

api.use(cors(corsOptions));
api.use(express.json());

adicionarRotas(api);

const port = process.env.PORT || 5010
api.listen(port, () => console.log(`..: API subiu com sucesso na porta ${port}`))


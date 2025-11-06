import express from 'express'
import loginController from './controller/loginController.js'
import provaController from './controller/provaController.js'
import respostaController from './controller/respostaController.js'

export function adicionarRotas(api) {
  api.use(loginController);
  api.use(provaController);
  api.use(respostaController);
  api.use('/public/storage', express.static('public/storage'));
}


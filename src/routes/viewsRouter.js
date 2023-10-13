import { Router } from 'express';
import { logger } from '../utils/logger.js'

const router = Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/local', (req, res) => {
  res.render('local');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/error-register', (req, res) => {
  res.render('errorRegister');
});

router.get('/error-login', (req, res) => {
  res.render('errorLogin');
});

router.get('/jwt', (req, res) => {
  res.render('jwt')
});

router.get("/loggerTest", (req, res) => {
  logger.error("Error en el endpoint de prueba");
  logger.info("Info en el endpoint de prueba")
  logger.debug("Debug en el endpoint de prueba")
});

router.get('/updatePass', (req, res)=>{res.render('updatePass')});

export default router;

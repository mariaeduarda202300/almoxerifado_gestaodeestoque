const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioscontroller.js');

router.post('/register', usuarioController.registerUsuario);
router.post('/login', usuarioController.doLogin);

// criar rotas de admin, remover usuarios, 
// listar usuários, etc. conforme necessário

module.exports = router;

const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionariocontroller');
const authenticateToken = require('../middlewares/auth');

router.post('/register', funcionarioController.registerFuncionario);
router.post('/login', funcionarioController.doLogin);
router.get('/obterTodosPedidosParaFuncionarios', authenticateToken,funcionarioController.obterTodosPedidosParaFuncionarios);


// criar rotas de admin, remover usuarios, 
// listar usuários, etc. conforme necessário

module.exports = router;

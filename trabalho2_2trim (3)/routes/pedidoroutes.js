const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidocontroller');
const authenticateToken = require('../middlewares/auth');



// Rota de boas-vindas (protegida)

// Rota para criar um novo produto (protegida)
router.post('/pedido', authenticateToken, pedidoController.createPedido);

// Rota para listar todos os produtos (protegida)
router.get('/pedido', authenticateToken, pedidoController.listPedidos);

// Rota para listar produtos do usuário logado (protegida)
//router.get('/me/products', authenticateToken, productController.getProductsByOwner);

// Rota para obter detalhes de um produto específico (protegida)
router.get('/pedido/:id', authenticateToken, pedidoController.getPedidoById);

// Rota para atualizar um produto existente (protegida)
router.put('/pedido/:id', authenticateToken, pedidoController.updatePedido);

// Rota para deletar um produto (protegida)
router.delete('/pedido/:id', authenticateToken, pedidoController.deletePedido);

router.get('/pedido', authenticateToken, pedidoController.getpedidoByOwner);

router.get('/notafiscal/:id', authenticateToken, pedidoController.obterResumoPedidos);



module.exports = router;


// CURL exemplos
// curl -X GET http://localhost:3000/api/products
// curl -X GET http://localhost:3000/me/products 
// curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"descricao":"Produto 1","preco":10.0,"quantidade":5}'
// curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{"descricao":"Produto 1 atualizado","preco":15.0,"quantidade":10}'
// curl -X DELETE http://localhost:3000/api/products/1
const express = require('express');
const produtoController = require('../controllers/produtocontroller');
const authenticateToken = require('../middlewares/auth');


const router = express.Router();


// Rota de boas-vindas (protegida)

// Rota para criar um novo produto (protegida)
router.post('/produtos', authenticateToken, produtoController.createProduto);

// Rota para listar todos os produtos (protegida)
router.get('/produtos', authenticateToken, produtoController.listProdutos);

// Rota para listar produtos do usuário logado (protegida)
//router.get('/me/products', authenticateToken, productController.getProductsByOwner);

// Rota para obter detalhes de um produto específico (protegida)
router.get('/produtos/:id', authenticateToken, produtoController.getProdutoById);

// Rota para atualizar um produto existente (protegida)
router.put('/produtos/:id', authenticateToken, produtoController.updateProduto);

// Rota para deletar um produto (protegida)
router.delete('/produtos/:id', authenticateToken, produtoController.deleteProduto);

module.exports = router;


// CURL exemplos
// curl -X GET http://localhost:3000/api/products
// curl -X GET http://localhost:3000/me/products 
// curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d '{"descricao":"Produto 1","preco":10.0,"quantidade":5}'
// curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -d '{"descricao":"Produto 1 atualizado","preco":15.0,"quantidade":10}'
// curl -X DELETE http://localhost:3000/api/products/1
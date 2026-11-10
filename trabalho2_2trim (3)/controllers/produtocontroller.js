const express = require('express')
const prisma = require("../config/db");

  
  async function listProdutos (req, res) {
      try {
        const produtos = await prisma.produto.findMany();
        res.json(produtos);
      } catch (err) {
        res.status(500).json({ error: "Error fetching produto" });
      }
  }

  /*async function getPedidoByOwner (req, res) {
    try {
      const pedido = await prisma.pedido.findMany({
        where: {
          userId: req.user.id,
        },
      });
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ error: "Error fetching pedido" });
    }
  }*/



  async function getProdutoById (req, res) {

      try {
        const produto = await prisma.produto.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });
        if (!produto) {
          return res.status(404).json({ error: "Produto not found" });
        }
        res.json(produto);
      } catch (err) {
        res.status(500).json({ error: "Error fetching produto",err});
      }
  }


  async function createProduto (req, res) {
    //console.log("User ID from token:", req.user.id); // Log the user ID from the token
    //console.log("Request body:", req.body); // Log the request body to see what data is being sent
    console.log (req.body)
      try {
        const produto = await prisma.produto.create({
          data: {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            estoque: req.body.estoque
          },
        });
        res.json(produto);
      } catch (err) {
        res.status(500).json({ error: "Error creating product", err });
      }
      
  }

 async function deleteProduto (req, res) {
      try {
        const produto = await prisma.produto.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });
        res.json(produto);
      } catch (err) {
        res.status(500).json({ error: "Error deleting produto" });
      }
 }
 
 async function updateProduto (req, res) {
      try {
        const produto = await prisma.produto.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: {
            nome: req.body.nome,
            descricao: req.body.descricao,
            preco: req.body.preco,
            estoque: req.body.estoque,

          },
        });
        res.json(produto);
      } catch (err) {
        console.log("Error updating produto:", err); // Log the error for debugging
        res.status(500).json({ error: "Error updating produto" });
      }
 }


    module.exports = {
      listProdutos,
      getProdutoById,
      createProduto,
      deleteProduto,
      updateProduto
    }
const express = require('express')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../config/db");



async function registerFuncionario (req, res) {
    const { nome, cargo,matricula ,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const funcionario = await prisma.funcionario.create({
        data: { nome, cargo,matricula,  password: hashedPassword },
      });
      res.json({ message: "funcionario registered successfully", funcionario });
    } catch (err) {
      res.status(400).json({ error: "User already exists" });
    }
  }
  
  // Login de usuário
  async function doLogin(req, res) {
    const { matricula, password } = req.body;
    
    const funcionario = await prisma.funcionario.findUnique({ where: { matricula } });
    if (!funcionario) return res.status(401).json({ error: "Invalid credentials" });
  
    const isValidPassword = await bcrypt.compare(password, funcionario.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ id: funcionario.id, 
                              nome: funcionario.nome,
                              matricula:  funcionario.matricula,
                              cargo:  funcionario.cargo,
                            }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    res.json({ token });
  }

  /*async function obterPedidoParaFuncionario(req, res) {
    try {
      // Captura o ID do pedido que vem pela URL (ex: /pedidos/funcionario/:id)
  
      const pedido = await prisma.pedido.findMany({
        where: {
          id: parseInt(req.params.id), // Busca o pedido específico pelo ID dele
        },
        select: {
          id: true,
          data: true,
          status: true,
          usuarioId: true, // EXIGIDO: Retorna diretamente o ID do usuário/cliente
          usuario: {
            select: {
              nome: true // Opcional: traz o nome do cliente para ajudar o funcionário
            }
          },
          produtos: {
            select: {
              quantidade: true, // EXIGIDO: Quantidade de cada produto no pedido
              produto: {
                select: {
                  id: true,
                  nome: true, // EXIGIDO: Nome do produto
                  preco: true
                }
              }
            }
          }
        }
      });
  
      // Se o pedido não for encontrado no banco de dados
      if (!pedido) {
        return res.status(404).json({ error: "Pedido não encontrado." });
      }
  
      // Formata a resposta para entregar um JSON limpo e direto para o funcionário
      let valorTotalPedido = 0;
      const produtosFormatados = (pedido.produtos || []).map(item => {
        const precoProduto = item.produto?.preco ?? 0;
        const subtotalItem = item.quantidade * precoProduto;
        valorTotalPedido += subtotalItem;
  
        return {
          produtoId: item.produto?.id,
          nome: item.produto?.nome ?? "Produto Removido",
          quantidade: item.quantidade,
          precoUnitario: precoProduto,
          subtotal: subtotalItem
        };
      });
  
      const respostaFinal = {
        pedidoId: pedido.id,
        dataPedido: pedido.data,
        statusAtual: pedido.status,
        clienteId: pedido.usuarioId, // ID do Usuário dono do pedido
        clienteNome: pedido.usuario?.nome ?? "Não informado",
        produtos: produtosFormatados,
        valorTotal: valorTotalPedido
      };
  
      return res.json(respostaFinal);
  
    } catch (error) {
      console.error("Erro ao buscar pedido para o funcionário:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao processar o pedido." });
    }
  }*/

    async function obterTodosPedidosParaFuncionarios(req, res) {
      try {
        // 1. Captura o ID do funcionário vindo da URL (ex: /pedidos/funcionario/:funcionarioId)
        const { funcionarioId } = req.params; 
        console.log(funcionarioId)
  
        if (!funcionarioId) {
          return res.status(400).json({ error: "ID do funcionário é obrigatório." });
        }
    
        // 2. Busca os pedidos FILTRANDO pelo funcionarioId
        const pedidos = await prisma.pedido.findMany({
          where: {
            funcionarioId: Number(funcionarioId) // Use apenas funcionarioId se for String/UUID
          },
          select: {
            id: true,
            data: true,
            status: true,
            usuarioId: true, 
            usuario: {
              select: { nome: true }
            },
            produtos: {
              select: {
                quantidade: true, 
                produto: {
                  select: { id: true, nome: true, preco: true }
                }
              }
            }
          },
          orderBy: { data: 'desc' }
        });
    
        if (!pedidos || pedidos.length === 0) {
          return res.status(200).json([]); 
        }
    
        // 3. Formata a lista (Mesma lógica do código anterior)
        const respostaFinal = pedidos.map(pedido => {
          let valorTotalPedido = 0;
          const produtosFormatados = (pedido.produtos || []).map(item => {
            const precoProduto = item.produto?.preco ?? 0;
            const subtotalItem = item.quantidade * precoProduto;
            valorTotalPedido += subtotalItem;
      
            return {
              produtoId: item.produto?.id,
              nome: item.produto?.nome ?? "Produto Removido",
              quantidade: item.quantidade,
              precoUnitario: precoProduto,
              subtotal: subtotalItem
            };
          });
  
          return {
            pedidoId: pedido.id,
            dataPedido: pedido.data,
            statusAtual: pedido.status,
            clienteId: pedido.usuarioId, 
            clienteNome: pedido.usuario?.nome ?? "Não informado",
            produtos: produtosFormatados,
            valorTotal: valorTotalPedido
          };
        });
    
        return res.json(respostaFinal);
    
      } catch (error) {
        console.error("Erro ao buscar pedidos do funcionário:", error);
        return res.status(500).json({ error: "Erro interno do servidor." });
      }
  }
  
  
  

module.exports = {
    registerFuncionario,
    doLogin,
    obterTodosPedidosParaFuncionarios
}
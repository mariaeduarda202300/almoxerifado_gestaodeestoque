const prisma = require("../config/db");

  
  async function listPedidos (req, res) {
      try {
        const pedidos = await prisma.pedido.findMany();
        res.json(pedidos);
      } catch (err) {
        res.status(500).json({ error: "Error fetching pedido" });
      }
  }

  async function getpedidoByOwner (req, res) {
    try {
      const pedido = await prisma.pedido.findMany({
        where: {
          usuarioId: req.usuario.id,
        },
      });
      res.json(pedido);
    } catch (err) {
      res.status(500).json({ error: "Error fetching pedido" });
    }
  }



  async function getPedidoById (req, res) {
    console.log(req.params.id)
      try {
        const pedido = await prisma.pedido.findUnique({
          where: {
            id: parseInt(req.params.id),
          },
        });
        if (!pedido) {
          return res.status(404).json({ error: "Pedido not found" });
        }
        res.json(pedido);
      } catch (err) {
        res.status(500).json({ error: "Error fetching pedido",err });
      }
  }


  async function createPedido (req, res) {
    console.log("User ID from token:", req.usuario.id); // Log the user ID from the token
  console.log("Request body:", req.body); // Log the request body to see what data is being sent
      try {
        const pedido = await prisma.pedido.create({
          data: {
            status: req.body.status,
            data:new Date(req.body.data),
            usuarioId: req.usuario.id,
            funcionarioId: req.body.funcionarioId
          },
        });
        res.json(pedido);
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error creating product", err });
      }
      
  }

 async function deletePedido (req, res) {
      try {
        const pedido = await prisma.pedido.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });
        res.json(produto);
      } catch (err) {
        res.status(500).json({ error: "Error deleting product" });
      }
 }
 
 async function updatePedido (req, res) {
      try {
        const pedido = await prisma.pedido.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: {
            status: req.body.status,
            data: req.body.data,
          },
        });
        res.json(produto);
      } catch (err) {
        console.log("Error updating product:", err); // Log the error for debugging
        res.status(500).json({ error: "Error updating product" });
      }
 }


 async function obterResumoPedidos(req, res) {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ error: "O parâmetro ID precisa ser um número válido." });
    }

    const pedidos = await prisma.pedido.findMany({
      where: {
        usuarioId: usuarioId, 
      },
      select: {
        id: true,
        data: true,   
        status: true, 
        usuario: {
          select: { nome: true }
        },
        funcionario: {
          select: { nome: true }
        },
        produtos: { 
          select: {
            quantidade: true,
            // REMOVIDO: precoUnitario da raiz de ProdutoPedido
            produto: { 
              select: { 
                nome: true,
                preco: true // INCLUÍDO: Buscando o preço diretamente da tabela Produto
              }
            }
          }
        },    
      },
      orderBy: { data: 'desc' },
    });

    if (!pedidos || pedidos.length === 0) {
      return res.json([]);
    }

    const pedidosComValores = pedidos.map(pedido => {
      let valorTotalPedido = 0;

      const produtosFormatados = (pedido.produtos || []).map(item => {
        // CORRIGIDO: Busca o preço de dentro do objeto do produto (garante 0 se não houver produto)
        const precoOriginal = item.produto?.preco ?? 0; 
        const valorItem = item.quantidade * precoOriginal;
        
        valorTotalPedido += valorItem; 

        return {
          nome: item.produto?.nome ?? "Produto Não Encontrado",
          quantidade: item.quantidade,
          preco: precoOriginal, // Retorna o preço individual do produto
          valorFinalItem: valorItem // Cálculo baseado em (quantidade * produto.preco)
        };
      });

      return {
        id: pedido.id,
        data: pedido.data,
        status: pedido.status,
        usuario: pedido.usuario?.nome ?? "Não informado", 
        funcionario: pedido.funcionario?.nome ?? "Não atribuído", 
        produtos: produtosFormatados,
        valorTotalPedido: valorTotalPedido 
      };
    });

    return res.json(pedidosComValores);

  } catch (error) {
    console.error("Erro ao buscar resumo dos pedidos:", error);
    return res.status(500).json({ error: "Erro interno ao buscar pedidos" });
  }
}



    module.exports = {
      listPedidos,
      getpedidoByOwner,
      getPedidoById,
      createPedido,
      deletePedido,
      updatePedido,
      obterResumoPedidos
    }
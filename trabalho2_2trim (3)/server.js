const express = require('express');
const cors = require('cors');
const produtoRoutes = require('./routes/produtoroutes');
const usersRoutes = require('./routes/usuarioroutes');
const pedidoRoutes = require('./routes/pedidoroutes');
const funcionarioRoutes = require('./routes/funcionarioroutes');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

app.use ('/api/', produtoRoutes);
app.use (usersRoutes);
app.use (pedidoRoutes);
app.use ('/funcionario/',funcionarioRoutes);

// Sample route

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
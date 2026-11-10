const express = require('express')
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = require("../config/db");



async function registerUsuario (req, res) {
    const { nome, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("nome",nome);
    console.log("email",email);
    console.log(hashedPassword);
    

  
    try {
        const usuario = await prisma.usuario.create({
        data: { nome, email, password: hashedPassword }
     
      });
      res.json({ message: "User registered successfully", usuario });
    } catch (err) {
      res.status(400).json({ error: "User already exists", debug_error:err});
    }
  }
  
  // Login de usuário
  async function doLogin(req, res) {
    const { email, password } = req.body;
  
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(401).json({ error: "Invalid credentials" });
  
    const isValidPassword = await bcrypt.compare(password, usuario.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });
  
    const token = jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    res.json({ token });
  }
  
  //async function mostratudo(req, res) {
  



module.exports = {
    registerUsuario,
    doLogin
}
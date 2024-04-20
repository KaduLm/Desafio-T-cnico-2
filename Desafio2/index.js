require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 
const Product = require('./models/productModel');
const app = express();

app.use(express.json());

const secretKey = '=rQ/gDwaKb6/7ImNPHWgc+vrzOynb2fnNV7vufLsiyOo=';


function generateToken(user) {
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '30m' });
    return token;
}

app.post('/product', async (req, res) => {
    try {
        const existingProduct = await Product.findOne({ email: req.body.email });

        if (existingProduct) {
            return res.status(400).json({ message: 'Email já está em uso.' });
        }

        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingProduct = await Product.findOne({ email });

        if (!existingProduct) {
            return res.status(401).json({ mensagem: 'Usuário e/ou password inválidos' });
        }

        if (password !== existingProduct.password) {
            return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
        }

        existingProduct.ultimo_login = new Date();
        await existingProduct.save();

        const token = generateToken(existingProduct);

        res.status(200).json({
            id: existingProduct._id,
            data_criacao: existingProduct.createdAt,
            data_atualizacao: existingProduct.updatedAt,
            ultimo_login: existingProduct.ultimo_login,
            token,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.post('/log-in', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
    }

    try {
        const verifiedToken = jwt.verify(token, secretKey);

        res.json({ mensagem: 'Acesso autorizado', dados: verifiedToken });
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
});

const PORT = 4755;

mongoose
    .connect('mongodb+srv://kadu4755:senha123@cluster0.zjghysa.mongodb.net/Desafio2')
    .then(() => {
        console.log('Conectado com o banco de dados');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Erro de conexão:', error);
    });

module.exports = app;

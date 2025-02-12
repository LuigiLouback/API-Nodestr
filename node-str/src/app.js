'use strict'
const express = require('express');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const config = require('./config');

mongoose.connect(config.connectionString)
.then(() => console.log("✅ Conectado ao MongoDB!"))
.catch(err => console.error("❌ Erro ao conectar no MongoDB:", err));
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order=require('./models/order');

const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');



app.use(bodyParser.json({
    limit:'5mb'
}));
app.use(bodyParser.urlencoded({extended:false}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/',indexRoute);
app.use('/products',productRoute);
app.use('/customers',customerRoute);
app.use('/orders',orderRoute);

module.exports=app;
'use strict';
const mongoose = require('mongoose');
const guid = require('guid');

const repository= require('../repositories/order-repository');
const { authenticate } = require('./customer-controller');
const authService=require('../services/auth-service');


exports.get = async(req,res,next) =>{
    try{
    var data = await repository.get()
 res.status(200).send(data);
    }catch(e){
        res.status(500).sesnd({
            message: 'Falha ao processar sua requisição'
        })
    }

}

exports.post=async(req,res,next)=>{

    try{


        const token=req.body.token||req.query.token||req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer :data.id,
            number:guid.raw().substring(0,6),
            itens:req.body.itens
        })
        res.status(201).send({
            message:'Pedido cadastrado com sucesso!'});}
            catch(e){
                res.status(500).send({
                    message:'Falha ao processar sua requisição'
                });
            }
   
};
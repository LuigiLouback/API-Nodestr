'use strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const ValidationContract=require('../validators/fluent-validator');
const repository= require('../repositories/customer-repository');
const md5 =require('md5');
const emailService = require('../services/email-service');
const authService=require('../services/auth-service');
const customer = require('../models/customer');

exports.post=async(req,res,next)=>{
    let contract=new ValidationContract();
    contract.hasMinLen(req.body.name,3,'O nome deve conter pelo menos 3 caracteres');
  //  contract.isEmail(req.body.email,'O email é inválido');
    contract.hasMinLen(req.body.password,3,'A senha deve conter pelo menos 3 caracteres');
    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }
 
    try{

        await repository.create({
            name:req.body.name,
            email:req.body.email,
            password:md5(req.body.password +global.SALT_KEY),
            roles:["user"]
        })
        console.log('📧 Enviando e-mail para:', req.body.email);

        emailService.send(req.body.email, 'Bem vindo ao Node store', global.EMAIL_TMPL.replace('{0}', req.body.name));
        
        console.log('✅ E-mail enviado com sucesso!');
        
        res.status(201).send({
            message:'Cliente cadastrado com sucesso!'});}
            catch(e){
                res.status(500).send({
                    message:'Falha ao processar sua requisição'
                });
            }
   
};

exports.authenticate=async(req,res,next)=>{
  
    try{

        const custumer = await repository.authenticate({
            email:req.body.email,
            password:md5(req.body.password +global.SALT_KEY)
        })
        if(!custumer){
            res.status(404).send({message: 'usuario ou senha ivnvalidos'})
            return;
        }
   const token = await   authService.generateToken({
    
    email:customer.email,
    name:customer.name,
    roles: customer.roles});
        
        res.status(201).send({
            token:token,
            data:{
                email:customer.email,
                name:customer.name
            },
            message:'Cliente cadastrado com sucesso!'});}
            catch(e){
                res.status(500).send({
                    message:'Falha ao processar sua requisição'
                });
            }
   
};

exports.refreshToken=async(req,res,next)=>{
  
    try{
         const token=req.body.token||req.query.token||req.headers['x-access-token'];
         const data = await authService.decodeToken(token);

        const custumer = await repository.getById(data.id)

        if(!custumer){
            res.status(404).send({message: 'cliente nao encontrado'})
            return;
        }
   const tokenData = await   authService.generateToken({
    id: customer._id,
    email:customer.email,
    name:customer.name,
    roles: customer.roles
});
        
        res.status(201).send({
            token:token,
            data:{
                email:customer.email,
                name:customer.name
            },
            message:'Cliente cadastrado com sucesso!'});}
            catch(e){
                res.status(500).send({
                    message:'Falha ao processar sua requisição'
                });
            }
   
};
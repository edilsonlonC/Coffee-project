'use strict'

const router = require('express').Router()
const config = require('../config/config')['dev']
const coffeeSellerController = require('../controller/coffee-seller')
const db = require('coffee-db')
let service, Seller

router.use('*', async (req,res,next)=>{
	if (!service){
		try{
			service = await db(config)
			console.log(service)
		}catch(e){
			console.log('error', e)
			return e
		}
		Seller = service.ModelSeller
	}
	next()
})

router.post('/coffee-seller', async(req,res)=>{
	//console.log('seller here', Seller)
	let { name , password , email } = req.body
	if (!name || !password || !email) return res.status(404).send({
		message : 'Faltan argumentos',
		ok: false
	})
	const seller = await Seller.create({
		name,
		password,
		email
	})
	
	return res.status(200).send({
		mensaje: 'success',
		ok:true,
		vendedor : seller.toJSON()
	})
})

router.get('/coffee-seller', async(req,res) => {
	let sellers = await Seller.findAll()
	return res.status(200).send({
		ok: true,
		vendedores : sellers
	})
})

router.get('/coffee-seller/:id', async(req,res)=>{
	const {id} = req.params
	const seller = await Seller.findOne({
		where : {
			id: id
		}
	})
	return res.status(200).send({

		ok: true,
		vendedor: seller

	})
})


// TODO : routes for delete and update
module.exports = {
	router
}

'use strict'
const router = require('express').Router()
const config = require('../config/config')['dev']
const db = require('coffee-db')
let service, Order

router.use('*',async(req,res,next)=>{
	if(!service){
		try{
			service = await db(config)

		}catch(e){
			return res.status(500).send({
				message : "Server Error",
				ok:false
			})
		}
		Order = service.ModelOrder
		
	}
	next()
})


router.post('/order',async(req,res)=>{
	let {description} = req.body
	try{

		const order = await Order.create({
			description
		})
		return res.status(201).send({
			ok:true,
			orden: order
		})
	}catch(e){
		return res.status(500).send({
			message:"Server Error",
			ok:false
		})
	}
})

router.get('/orders', async(req,res)=>{
	const  orders = await Order.findAll()
	return  res.status(200).send({
		ok:true,
		ordenes : orders
	})
})

router.get('/order/:id', async (req,res)=>{
	let {id} = req.params
	const order = await Order.findOne({
		where:{
			id
		}
	})
	return res.status(200).send({
		ok:true,
		orden: order
	})
})


module.exports = router

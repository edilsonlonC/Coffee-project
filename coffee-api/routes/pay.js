'use strict'

const router = require('express').Router()
const Stripe = require('stripe')
const db = require('coffee-db')
const config = require('../config/config')['dev']
let service , Order ,Buyer, Product


router.use('*',async (req,res,next)=>{
	if (!service){
		try{

			service = await db(config)


		}catch(err){
			console.log(err)
			return res.status(500).send({
				message:"Server error",
				ok:false
			})
		}
		Order = service.ModelOrder
		Buyer = service.ModelBuyer
		Product = service.ModelProduct
	
	}
	next()


})



router.post('/pay/stripe', async(req,res) => {
	const stripe = Stripe('sk_test_51Hv6WqDV9nnhszpku5ba1gYBkFp4vwTpH6VP3s6Ylzw5HOC50wkHp7EeKyNx4utFdIFJJCS1ln9iZuZeN3cHa21w00f1cY3Bfp')
		
	const { charge , order } = req.body
	console.log(charge)
	stripe.charges.create(charge,async (err,charge2)=>{
		if (err) {
			console.log(err)
			return res.status(500).send({
			message : 'Erro al pagar',
			ok:false
		})

		}
		try{
			const  new_order = await  Order.create(order)
			return res.status(200).send({
				message:"pago existoso",
				ok:true,
				charge2,
				order : new_order


		})
		}catch(e){
			console.log(e)
			return res.status(500).send({
				message : "Server Errro",
				ok:false
			})
		}
			})
})


router.get('/orders',async (req,res)=>{

	try{

		const oders = await Order.findAll()
		return res.status(200).send({
			ok:true,
			ordenes: orders.toJSON()
		})

	}catch(err){
		return res.status(500).send({
			message : "Server Error",
			ok:false
		})
	}

})

router.get('/orders-seller/:id',async(req,res)=>{
	const { id }	 = req.params
	try{
		const orders = await Order.findAll({
		
			include:[{
				model:Product,
				where:{
					SellerId:id
				}
			},
				Buyer
			]
		})

		return res.status(200).send({
			ok:true,
			ordenes:orders
		})
	}catch(e){
		console.log(e)
		return res.status(500).send({
			message:'Server error',
			ok:false
		})
	}
})

router.get('/orders-buyer/:id', async(req,res)=>{
	const { id } = req.params
	try{
		const orders = await Order.findAll({
			where:{
				BuyerId:id
			},
			include:[Product]
		})
		return res.status(200).send({
			ok:true,
			ordenes:orders
		})
	}catch(e){
		console.log(e)
		return res.status(500).send({
			message:'Server error',
			ok:false
		})
	}

})


module.exports = router

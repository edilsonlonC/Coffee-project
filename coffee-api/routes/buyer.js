'use strict'
const router = require('express').Router()
const config = require('../config/config')['dev']
const db = require('coffee-db')

let service, Buyer

router.use('*', async(req,res,next)=>{
	if(!service){
		try{
			service = await db(config)
		}catch(e){
			console.log(e)
			return e
		}
		Buyer = service.ModelBuyer
	}
	next()
})

router.post('/buyer', async(req,res)=>{
	let { name , email, password , description} = req.body
	if (!name || !email || !password) return res.status(404).send({
		message: 'Faltan argumentos',
		ok: false
	})
	try{
			const buyer = await Buyer.create({
			name,email,password,description
		})
		return res.status(201).send({
			ok:true,
			comprador : buyer
		})

	}catch(e){
		return res.status(500).send({
			error : "Error en el servidor",
			ok:false
		})
	}

})

router.get('/buyers', async(req,res) =>{
	try{
			
		const buyers =await Buyer.findAll()
		return res.status(200).send({
			ok:true,
			compradores : buyers
		})
	}catch(err){
		return res.status(500).send({
			message: 'Server Error',
			ok:false
		})
	}
})

router.get('/buyer/:id', async (req,res) => {
	
	const { id } = req.params

	try{

		const buyer = await Buyer.findOne({
			where:{
				id
			}
		})
		return res.status(200).send({
			ok: true,
			comprador: buyer
		})
	  
	}catch(e){
		console.log(e)
		return res.status(500).send({
			message : 'Server Error',
			ok: false
		})
	}
})



module.exports = router

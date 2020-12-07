'use strict'
const router = require('express').Router()
const config = require('../config/config')['dev']
const db = require('coffee-db')
const { generate_token } = require('../auth/auth')
const { generate_hash, compare_hash } = require('../crypt/crypt')
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
	password = generate_hash(password)
	try{
			
			const buyer = await Buyer.create({
			name,email,password,description
			})
		const data = buyer.toJSON()
		delete data['password']
		const token = generate_token(data)
		return res.status(201).send({
			ok:true,
			comprador : data,
			token,
			
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

router.post('/buyer/login/',async(req,res)=>{
	const { email , password } = req.body
	console.log('email')
	const buyer = await Buyer.findOne({
		where: {
			email
		}
	})
	if(!buyer) return res.status(401).send({
		massage:"No autorizado",
		ok:false
	})
	const data = buyer.toJSON()
	delete data['password']
	if(compare_hash(password,buyer.password)){
		const token = generate_token(data)
		return res.status(200).send({
			ok:true,
			token,
			comprador: data
		})
	}
	return res.status(401).send({
		message: "No autorizado",
		ok:false,
	})
})

module.exports = router

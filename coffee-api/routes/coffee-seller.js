'use strict'

const router = require('express').Router()
const config = require('../config/config')['dev']
const coffeeSellerController = require('../controller/coffee-seller')
const db = require('coffee-db')
const { generate_hash, compare_hash } = require('../crypt/crypt')
const { generate_token } = require('../auth/auth')
const { SellerisAuth } = require('../middlewares/middlewares')
const {Sequelize} = require('sequelize')

let service, Seller, Product

async function userExist(req,res,next){

	const {email,password} = req.body
	if(!email||!password) return res.status(404).send({
		message:"Faltan argumentos",
		ok:false
	})
	try{
		const user = await Seller.findOne({
			where:{
				email,
			}
		})
		if (user) return res.status(404).send({
			message: "El usuario ya existe",
			ok:false
		})
		next()

	}catch(e){
		return res.status(500).send({
			message : "Server error",
			ok:false
		})
	}



}



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
		Product = service.ModelProduct
	}
	next()
})

router.post('/coffee-seller',userExist ,async(req,res)=>{
	//console.log('seller here', Seller)
	let { name , password , email } = req.body
	if (!name || !password || !email) return res.status(404).send({
		message : 'Faltan argumentos',
		ok: false
	})
	password = generate_hash(password)	
	const seller = await Seller.create({
		name,
		password,
		email
	},
		
	)
	const data = seller.toJSON()
	delete data['password']
	const token = generate_token(data)
	
	return res.status(200).send({
		mensaje: 'success',
		ok:true,
		vendedor : data,
		token
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
router.get('/coffee-seller/product/:id', async (req,res) =>{
	const { id } = req.params
	const { search } = req.query
	if (search){
		const op = Sequelize.Op
		const products = await Product.findAll({
			where:{
				SellerId:id,
					[op.or]:{
						description:{
							[op.like]: `%${search}%`
						},
						name:{
							[op.like]:`%${search}%`
						}
					}
			}
		})
		return res.status(200).send({
			ok:true,
			productos:products
		})
	}
	const products = await Product.findAll({
		where:{
			SellerId: id
		}
	})
	return res.status(200).send({
		ok:true,
		productos : products
	})
})

router.post('/coffee-seller/login/',async(req,res)=>{
	const { email , password } = req.body
	if(!email || !password) return res.status(404).send({
		message:'Faltan argumentos',
		ok:false
	})
	const seller = await Seller.findOne({
		where:{
			email
		}
	})
	if(!seller) return res.status(401).send({message:"No autorizado",ok:false})
	const data = seller.toJSON()
	delete data['password']	
	if (compare_hash(password,seller.password)){
		const token = generate_token(data)
		return res.status(200).send({
			ok:true,
			token,
			vendedor:data
		})
	}


	return res.status(401).send({
		message:'No autorizado',
		ok:false
	})
})

router.put('/coffee-seller/:id',async(req,res)=>{
	const { id } = req.params
	const { name } = req.body
	try{

		const response = await Seller.update({
			name

		},{
			where:{
				id
			}
		})

		return res.status(200).send({
			ok:true,
			response
		})

	}catch(e){
		return res.status(500).send({
			message:"Server error",
			ok:false
		})
	}

})

// TODO : routes for delete and update
module.exports = {
	router
}

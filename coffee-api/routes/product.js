'use strict'
const router = require('express').Router()
const config = require('../config/config')['dev']
const db = require('coffee-db')
const crypto = require('crypto')
const { Sequelize } = require('sequelize')
const { SellerisAuth , BuyerisAuth  } = require('../middlewares/middlewares')
let service , Product , Seller

router.use('*', async(req,res,next) => {

	if(!service){
		try{
			service = await db(config)
		}catch(e){
			console.log(e)
			return e
		}
		Product = service.ModelProduct
		Seller = service.ModelSeller
	}
	next()
	

})

router.post('/product/upload/:id',async(req,res,next) => {
	const { id } = req.params
	console.log(req.files)
	let image_product = req.files.product
	console.log('image pr',image_product)
	const splited_name = image_product.name.split('.')
	const extension = splited_name[splited_name.length - 1]
	console.log(extension)
	// TODO : create a secret key
	let newname = crypto.createHmac('sha256','1234').update(image_product.data.toString()).digest('hex')
	console.log(newname)
	let complete_name = `${newname}.${extension}`

	image_product.mv('./public/uploads/'+ complete_name);
	const product = await Product.update({img: complete_name},{
		where:{
			id
		}
	})
	return res.status(200).send({
		message: 'img uploaded',
		producto:product
	})
})

router.post('/product',async (req,res) =>{
	
	let { name,price,SellerId,description } = req.body
	if (!name || !price || !SellerId) return res.status(404).send({message: "Faltan argumentos"})
	try{
		const product = await Product.create({
			name,
			price,
			SellerId,
			description
		})
		return res.status(200).send({
			ok:true,
			producto: product
		})

	}catch(e){
		return res.status(500).send({
			message: 'Server Error',
			ok:false
		})
	}
	

}
)
router.get('/products', async(req,res)=>{
	const { search } =  req.query
	
	try{

		if( search ){
			const op = Sequelize.Op
			const products = await Product.findAll({
				where:{
					[op.or]:[
						{
							description:{
								[op.like] : `%${search}%`
							}
						},
						{
							name:{
								[op.like]:`%${search}%`
							}
						}
					]
				}
			})
		
		return res.status(200).send({
			ok:true,
			productos : products
		})
	}

		const products = await Product.findAll()
		return res.status(200).send({
			ok:true,
			productos: products
		})

	}catch(e){
		console.log(e)
		return res.status(500).send({
			message: 'Server Error',
			ok:false
		})
	}
})

router.get('/product/:id',async(req,res)=>{
	const { id } = req.params
	try{

		const product = await Product.findOne({
			where:{
				id
			}
		})
		return res.status(200).send({
			ok:false,
			producto: product
		})

	}catch(e){
		return res.status(500).send({
			message: "Server Error",
			ok:false
		})
	}
})

router.get('/products/seller',async(req,res)=>{
	const { search } = req.query
	
	if( search ){
			const op = Sequelize.Op
			const products = await Product.findAll({
				where:{
					[op.or]:[
						{
							description:{
								[op.like] : `%${search}%`
							}
						},
						{
							name:{
								[op.like]:`%${search}%`
							}
						}
					]
				},
				include:[Seller]
			})
		
		return res.status(200).send({
			ok:true,
			productos : products
		})
	}	
	const products = await Product.findAll({
		include:[
			{
				model:Seller,
				as:"Seller"
			}
		]
	})
	return res.status(200).send({
		ok:true,
		productos:products
	})
})



router.put('/product/:id',async(req,res) =>{
	const { name , description, price } = req.body
	const { id } = req.params
	try{
		const response = await Product.update({name,description,price},{
			where:{
				id
			}
		})
		return res.status(200).send({
			ok:true,
			response
		})

	}catch(e){
		console.log(e)
		return res.status(500).send({
			message:"Server error",
			ok:false
		})
	}

})

router.delete('/product/:id',async(req,res)=>{
	const { id } = req.params
	try{
		const response = await Product.destroy({
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
			message: "Server Error",
			ok:false
		})
	}
})

module.exports = router

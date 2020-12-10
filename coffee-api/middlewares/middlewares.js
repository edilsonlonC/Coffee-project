'use strict'

const db = require('coffee-db')

const config = require('../config/config')["dev"]
const { verify_token } = require('../auth/auth')

let service,Seller,Buyer

async function getModels(){

	if (!service){

		try{

			service = await db(config)
			console.log(' service ' ,service)


		}catch(e){
			console.error(e)

		}
		Seller = service.ModelSeller
		Buyer = service.ModelBuyer
		console.log(Seller)

	}
	return {
		Seller,
		Buyer
	}
}

async function SellerisAuth(req,res,next){
	const { Seller  } = await getModels()
	const { authorization } = req.headers
	if(!authorization) return res.status(404).send({
		message:'Falta el token',
		ok:false
	})
	const token = authorization.split(' ')[1]
	const decode = verify_token(token)
	if (decode){
		console.log('decode ' , decode)
		const { email } = decode
		const seller = await Seller.findOne({
			where:{
				email
			}
		})
		if(seller) return next()

		else return res.status(401).send({
		message:"unauthoized",
		ok:false
	})

	} 
	else return res.status(401).send({
		message:"unauthoized",
		ok:false
	})

}

async function BuyerisAuth(req,res,next){
	const { Buyer  } = await getModels()
	const { authorization } = req.headers
	if(!authorization) return res.status(404).send({
		message:'Falta el token',
		ok:false
	})
	const token = authorization.split(' ')[1]
	const decode = verify_token(token)
	if (decode){
		console.log('decode ' , decode)
		const { email } = decode
		const buyer = await Buyer.findOne({
			where:{
				email
			}
		})
		if(buyer) return next()

		else return res.status(401).send({
		message:"unauthoized",
		ok:false
	})

	} 
	else return res.status(401).send({
		message:"unauthoized",
		ok:false
	})
}

module.exports = {
	SellerisAuth,
	BuyerisAuth
}

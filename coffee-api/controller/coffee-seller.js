'use strict'
const config = require('../config/config') 
const ModelCoffeeSeller = require('../models/coffee-seller')


let CoffeeSeller = null

async function getModel(){
	if (!CoffeeSeller) CoffeeSeller = await ModelCoffeeSeller()
	return CoffeeSeller
}


async function createSellerCoffee(req,res){

	const coffeeSeller = await getModel()
	const info_to_save = req.body
	console.log(info_to_save)
	console.log('coffee seller instance ' , coffeeSeller)
	const coffee_seller = await coffeeSeller.create(info_to_save)
	return res.status(200).send({
		createSellerCoffee: 'working',
		user: coffee_seller.toJSON()
	})
}


module.exports = {
	createSellerCoffee
}

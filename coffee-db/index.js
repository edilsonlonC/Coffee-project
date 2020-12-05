'use strict'

//const config = require('./config/config')["dev"]
const setup = require('./lib/setup')
const SetupModelSeller= require('./models/coffee-seller')
const SetupModelOrder = require('./models/order')
const SetupModelBuyer = require('./models/buyer')
const SetupModelProduct = require('./models/product')


async function main(config){
	// database configuration
	const sequelize = setup(config)
	// get  Models 
	const ModelSeller = SetupModelSeller(config)
	const ModelProduct = SetupModelProduct(config)
	const ModelOrder = SetupModelOrder(config)
	const ModelBuyer = SetupModelBuyer(config)
//relation seller and product
	ModelSeller.hasMany(ModelProduct)
	ModelProduct.belongsTo(ModelSeller)
	// relation product and order
	ModelProduct.hasMany(ModelOrder)
	ModelOrder.belongsTo(ModelProduct)
	//relation buyer order
	ModelBuyer.hasMany(ModelOrder)
	ModelOrder.belongsTo(ModelBuyer)
	
	
	await sequelize.sync({alter:true})
	return {
		ModelSeller,
		ModelOrder,
		ModelBuyer,
		ModelProduct
	}
}

module.exports = main

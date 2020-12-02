'use strict'

const { DataTypes , Sequelize} = require('sequelize')
const config = require('../config/config')['dev']
const db = require('../database/database')

const sequelize = db(config)

async function modelCoffee(){

const CoffeeSeller = sequelize.define("CoffeeSeller", {
		//TODO: generate model for coffee seller
		id_seller:{
			
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4
			
		},
		name:{
			type: DataTypes.STRING,
			allowNull: false
		},
		email : {
			type : DataTypes.STRING,
			allowNull : false
		},
		password: {
			type : DataTypes.STRING(300),
			allowNull: false
		}



})
	await CoffeeSeller.sync({force:true}) // change productio
		return CoffeeSeller

}

	module.exports = modelCoffee

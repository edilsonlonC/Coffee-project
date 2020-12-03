'use strict'
const { Sequelize, DataTypes } = require('sequelize')
const setup = require('../lib/setup')

function coffeeSeller(config){
	let sequelize = setup(config)	
	return sequelize.define('Seller', {
		seller_id : {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		name : {
			type: DataTypes.STRING,
			allowNull: false
		},
		email : {
			type: DataTypes.STRING,
			allowNull: false

		},
		password : {
			type : DataTypes.STRING(300),
			allowNull : false
		}


	})


}

module.exports = coffeeSeller

'use strict'
const { Sequelize } = require ('sequelize')
let sequelize  = null


module.exports = function db(config){
	const {database , username, password, dialect, host } = config

	if(!sequelize) sequelize = new Sequelize(database,username,password,{
		dialect: dialect,
		host: host
	})
	return sequelize

}


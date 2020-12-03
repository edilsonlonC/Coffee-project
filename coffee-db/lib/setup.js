'use strict'
const { Sequelize } = require('sequelize')
let sequelize = null
function setup(config){
	let { database , username, password, host, dialect} = config
	if (!sequelize) sequelize = new Sequelize(database,username,password,{
		host,
		dialect
	})
	return sequelize

}


module.exports = setup

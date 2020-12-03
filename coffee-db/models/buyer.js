const {Sequelize , DataTypes} = require('sequelize')
const setup = require('../lib/setup')

module.exports = function (config){
	const sequelize =  setup(config)
	return sequelize.define('Buyer', {
		id_buyer:{
			type: DataTypes.UUID,
			defaultValue : Sequelize.UUIDV4
		},
		name :{
			type : DataTypes.STRING,
			allowNull:false
		},
		email:{
			type: DataTypes.STRING,
			allowNull: false
		},
		password : {
			type: DataTypes.STRING(300),
			allowNull: false
		}
		
	})
}

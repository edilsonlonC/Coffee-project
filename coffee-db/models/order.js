const { Sequelize , DataTypes } = require('sequelize')
const setup = require('../lib/setup')


module.exports = function (config){

	const sequelize = setup(config)
	return sequelize.define('Order' , {
		id_order : {
			type : DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		description: {
			type: DataTypes.TEXT
		}

	})

}

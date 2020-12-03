const { Sequelize , DataTypes } = require('sequelize')
const setup = require('../lib/setup')

module.exports = function (config){
	const sequelize = setup(config)
	return sequelize.define('Product', {
		id_product: {
			type: DataTypes.UUID,
			defaultValue: Sequelize.UUIDV4
		},
		name : {
			type : DataTypes.STRING,
			allowNull: false
		},
		description : {
			type: DataTypes.TEXT
		},
		img: {
			type: DataTypes.STRING(300),

		},
		price : {
			type: DataTypes.FLOAT,
			allowNull:false
		}
	})
}



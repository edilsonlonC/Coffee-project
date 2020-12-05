'use strict'
const bcrypt = require('bcrypt')
function generate_hash(text,saltRounds=10){

	const salt = bcrypt.genSaltSync(saltRounds)
	const hash = bcrypt.hashSync(text,salt)
	return hash
	

}

function compare_hash(password,hash){
	return bcrypt.compareSync(password,hash)
}


module.exports = {
	generate_hash,
	compare_hash
}

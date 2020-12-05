const jwt = require('jsonwebtoken')

function generate_token(data){
	const token  = jwt.sign(data,'1234',{expiresIn: 60*60})
	return token
}

function verify_token(token){
	try{
		const decoded = jwt.verify(token,'1234')
		return decoded
	}catch(e){
		return  
	}
}
module.exports = {
	generate_token,
	verify_token
}

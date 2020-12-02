const router = require('express').Router()
const coffeeSellerController = require('../controller/coffee-seller')


router.get('/coffee-seller', coffeeSellerController.createSellerCoffee)



module.exports = {
	router
}

'use strict'
const express = require('express')
const morgan = require('morgan')
// routers 
const coffeeSellerRouter = require('./routes/coffee-seller')


const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(morgan('dev'))

app.use('/api',coffeeSellerRouter.router)


app.listen(port,() => {
	console.log(`Server is running on port ${port}`)
})



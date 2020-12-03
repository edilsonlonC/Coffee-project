'use strict'
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
// routers 
const coffeeSellerRouter = require('./routes/coffee-seller')
const buyerRouter = require('./routes/buyer')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const port = process.env.PORT || 3000
const app = express()
app.use(fileUpload({
	createParentPath: true
}))
app.use(express.static('uploads'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.use('/api',coffeeSellerRouter.router)
app.use('/api', buyerRouter)
app.use('/api', productRouter)
app.use('/api',orderRouter)


app.listen(port,() => {
	console.log(`Server is running on port ${port}`)
})



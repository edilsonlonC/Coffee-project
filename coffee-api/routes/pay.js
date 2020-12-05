const router = require('express').Router()
const Stripe = require('stripe')

router.post('/pay/stripe', async(req,res) => {
	const stripe = Stripe('sk_test_51Hv6WqDV9nnhszpku5ba1gYBkFp4vwTpH6VP3s6Ylzw5HOC50wkHp7EeKyNx4utFdIFJJCS1ln9iZuZeN3cHa21w00f1cY3Bfp')
		
	const charge = req.body
	console.log(charge)
	stripe.charges.create(charge,(err,charge2)=>{
		if (err) {
			console.log(err)
			return res.status(500).send({
			message : 'Erro al pagar',
			ok:false
		})

		}
		return res.status(200).send({
			message:"pago existoso",
			ok:true,
			charge2
		})
	})
	


}

)

module.exports = router

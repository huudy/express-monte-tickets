const express = require("express");
const router = new express.Router();

router.post("/payment", async (req, res) => {
	try {
		const payment = new Payment({
			reservation: req.body.reservationId,
		});
		const insertedPayment = await payment.save();
		res.status(201).send(insertedPayment);
	} catch (err) {
		log.error(
			"Error occured when trying to save reservation. Details: " + e.message
		);
		res.status(500).send(err);
	}
});

module.exports = router;

const express = require("express");
const router = new express.Router();
const Payment = require("../models/payment");
const {
	isReservationValid,
	externalPayment,
} = require("../middleware/payments");
let log = require("log4js").getLogger("reservations");

router.post(
	"/payment",
	isReservationValid,
	externalPayment,
	async (req, res) => {
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
	}
);

module.exports = router;

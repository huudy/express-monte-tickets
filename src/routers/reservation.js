const express = require("express");
const router = new express.Router();

router.post("/reservations", async (req, res) => {
	const reservation = new Reservation({
		...req.body,
		event: req.body.eventId,
	});
	try {
		await reservation.save();
		await reservation.toJSON();
		res.status(201).send({ reservation });
	} catch (err) {
		log.error(
			"Error occured when trying to save reservation. Details: " + e.message
		);
		res.status(500).send(err);
	}
});

module.exports = router;

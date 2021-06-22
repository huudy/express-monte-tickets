const { Reservation } = require("../models/reservation");
const charge = require("../util/paymentGateway");

const isReservationValid = async (req, res, next) => {
	try {
		const FIFTEEN_MIN = 15 * 60 * 1000;
		const reservation = await Reservation.findById(req.body.reservationId);

		if (!reservation) {
			throw new Error(
				"Could not find reservation with id: " + req.param.reservation_id
			);
		}
		if (reservation.isPaid) {
			throw new Error(
				`Reservation with id: ${reservation._id} is already paid for`
			);
		}

		if (new Date() - new Date(reservation.createdAt) > FIFTEEN_MIN) {
			await reservation.delete();
			throw new Error(
				"Your reservation is no longer valid! Next time please finish payment within 15min."
			);
		}

		req.body.currentReservation = await reservationBeingProcessed(reservation);
		next();
	} catch (e) {
		res.status(400).send({
			error: e.message,
		});
	}
};
const externalPayment = async (req, res, next) => {
	const { currentReservation, token } = req.body;
	try {
		await charge(currentReservation.totalAmount, token);
		await reservationPaid(currentReservation);
		next();
	} catch (e) {
		await prelongReservation(currentReservation);
		res.status(400).send({
			error: `${e.message}. You have another 15min to finish your payment.`,
		});
	}
};
const prelongReservation = async (reservation) => {
	try {
		reservation.isBeingProcessed = false;
		reservation.createdAt = new Date();
		await reservation.save();
	} catch (err) {
		throw new Error(err.message);
	}
};
const reservationPaid = async (reservation) => {
	try {
		reservation.isPaid = true;
		await reservation.save();
	} catch (err) {
		throw new Error(err.message);
	}
};
const reservationBeingProcessed = async (reservation) => {
	try {
		reservation.isBeingProcessed = true;
		return await reservation.save();
	} catch (err) {
		throw new Error(err.message);
	}
};

module.exports = { isReservationValid, externalPayment };

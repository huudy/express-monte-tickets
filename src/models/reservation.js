let mongoose = require("mongoose");
const SellingOption = {
	ALL_TOGETHER: 0,
	AVOID_ONE: 1,
	EVEN: 2,
};
Object.freeze(SellingOption);

let ReservationSchema = new mongoose.Schema({
	isBeingProcessed: {
		type: Boolean,
		default: false,
	},
	isPaid: {
		type: Boolean,
		default: false,
	},
	ticketQuantity: {
		type: Number,
		required: true,
	},
	totalAmount: {
		type: Number,
		required: true,
	},
	sellingOption: {
		type: SellingOption,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: new Date(),
	},
	paymentTries: {
		type: Number,
		required: true,
		default: 0,
	},
	event: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Event",
	},
});

ReservationSchema.methods.toJSON = function () {
	const reservation = this;
	const reservationObject = reservation.toObject();

	delete reservationObject.createdAt;
	delete reservationObject.isBeingProcessed;
	delete reservationObject.event;
	delete reservationObject.__v;

	return reservationObject;
};

let Reservation = mongoose.model("Reservation", ReservationSchema);

module.exports = { Reservation, SellingOption };

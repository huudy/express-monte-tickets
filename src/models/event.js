const mongoose = require("mongoose");

const RowSchema = new mongoose.Schema({
	numberOfSeats: {
		type: Number,
		required: true,
	},
	aisleSeats: {
		type: [Number],
		default: [],
	},
	reservedSeats: {
		type: [Number],
		default: [],
	},
});

const EventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true,
	},
	seatInfo: {
		type: Map,
		of: RowSchema,
		required: true,
	},
	ticketPrice: {
		type: Number,
		required: true,
	},
});

EventSchema.virtual("reservations", {
	ref: "Reservation",
	localField: "_id",
	foreignField: "event",
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;

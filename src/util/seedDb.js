const Event = require("../../src/models/event");
const mongoose = require("mongoose");

let seats = new Map();
seats.set("A", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});
seats.set("B", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});
seats.set("C", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});
seats.set("D", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});

const eventId = new mongoose.Types.ObjectId();
const event = {
	_id: eventId,
	name: "Huge Concert",
	seatInfo: seats,
	ticketPrice: 30,
};

const seedDBwithEvent = async () => {
	await Event.deleteMany();
	const newEvent = await new Event(event).save();
	// Logging out the id for testing purposes
	console.log(newEvent._id);
};
seedDBwithEvent();

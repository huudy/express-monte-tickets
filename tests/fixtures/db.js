const mongoose = require("mongoose");
const Event = require("../../src/models/event");
const { Reservation } = require("../../src/models/reservation");
const SIXTEEN_MIN = 16 * 60 * 1000;
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

let reservationSeats = new Map();
reservationSeats.set("A", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});

let reservationSeatsTwo = new Map();
reservationSeatsTwo.set("B", {
	numberOfSeats: 10,
	aisleSeats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	reservedSeats: [],
});

const eventId = new mongoose.Types.ObjectId();
const event = {
	_id: eventId,
	name: "Great Concert",
	seatInfo: seats,
	ticketPrice: 30,
};

const reservationId = new mongoose.Types.ObjectId();
const reservationOne = {
	_id: reservationId,
	seatInfo: reservationSeats,
	totalAmount: 60,
	ticketQuantity: 2,
	sellingOption: 0,
	event: eventId,
};

const reservationIdTwo = new mongoose.Types.ObjectId();
const reservationTwo = {
	_id: reservationIdTwo,
	seatInfo: reservationSeats,
	totalAmount: 60,
	ticketQuantity: 2,
	sellingOption: 0,
	event: eventId,
};

const reservationIdThree = new mongoose.Types.ObjectId();
const reservationThree = {
	_id: reservationIdThree,
	seatInfo: reservationSeats,
	totalAmount: 60,
	ticketQuantity: 2,
	sellingOption: 0,
	createdAt: new Date(Date.now() - SIXTEEN_MIN),
	event: eventId,
};

const wrongId = new mongoose.Types.ObjectId();

const insertEvent = async () => {
	await Event.deleteMany();
	await new Event(event).save();
};

const setupDBforPayments = async () => {
	await Reservation.deleteMany();
	await new Reservation(reservationOne).save();
	await new Reservation(reservationTwo).save();
	await new Reservation(reservationThree).save();
};

module.exports = {
	eventId,
	insertEvent,
	reservationId,
	reservationIdTwo,
	reservationIdThree,
	wrongId,
	setupDBforPayments,
};

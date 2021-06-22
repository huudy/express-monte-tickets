const Event = require("../../src/models/event");

const mongoose = require("mongoose");
const log = require("log4js").getLogger("mongoose");

const db = mongoose.connection;
const connect = () => {
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		autoReconnect: true,
		useCreateIndex: true,
	});
};

db.on("connecting", function () {
	log.debug("connecting to MongoDB...");
});

db.on("error", function (error) {
	log.error("Error in MongoDb connection: " + error);
	mongoose.disconnect();
});
db.on("connected", function () {
	log.debug("MongoDB connected!");
});
db.once("open", function () {
	log.debug("MongoDB connection opened!");
});
db.on("reconnected", function () {
	log.debug("MongoDB reconnected!");
});
db.on("disconnected", function () {
	log.debug("MongoDB disconnected!");
	setTimeout(() => {
		connect();
	}, 3000);
});
connect();

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

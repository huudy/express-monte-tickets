const request = require("supertest");
const app = require("../src/app");
const Payment = require("../src/models/payment");
const {
	reservationId,
	setupDBforPayments,
	reservationIdTwo,
} = require("./fixtures/db");

beforeAll(setupDBforPayments);

test("Should pay for a reservation if paid within 15 min", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId,
			token: "",
		})
		.expect(201);
	console.log(response.error);
	const dbPayment = await Payment.findById(response.body._id);
	// Check if it was inserted with proper reservationId
	expect(response.body.reservationId).toEqual(dbPayment.reservationId);
});
test("Should not be able to pay twice for a reservation", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId,
			token: "",
		})
		.expect(400);
});

test("Should not pay for a reservation if card error", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationIdTwo,
			token: "card_error",
		})
		.expect(400);
	// console.log(response.error);
	const dbPayment = await Payment.findById(response.body._id);
	// Check if it was inserted with proper reservationId
	expect(dbPayment).toEqual(null);
});
test("Should not pay for a reservation if payment error", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationIdTwo,
			token: "payment_error",
		})
		.expect(400);
	// console.log(response.error);
	const dbPayment = await Payment.findById(response.body._id);
	// Check if it was inserted with proper reservationId
	expect(dbPayment).toEqual(null);
});

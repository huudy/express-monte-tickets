const request = require("supertest");
const app = require("../src/app");
const Payment = require("../src/models/payment");
const { Reservation } = require("../src/models/reservation");
const {
	reservationId,
	setupDBforPayments,
	reservationIdTwo,
	wrongId,
	reservationIdThree,
	cleanupDB,
} = require("./fixtures/db");

beforeAll(setupDBforPayments);

test("Should create payment for a reservation if paid within 15 min", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId,
			token: "",
		})
		.expect(201);
	const dbPayment = await Payment.findById(response.body._id);
	expect(response.body.reservationId).toEqual(dbPayment.reservationId);
});
test("Should not be able to pay twice for the smae reservation", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId,
			token: "",
		})
		.expect(400);
	expect(response.error.text).toMatch(/is already paid for/);
});

test("Should not create a payment for a reservation if card error", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId: reservationIdTwo,
			token: "card_error",
		})
		.expect(400);
	expect(response.error.text).toMatch(/Your card has been declined/);

	const dbPayment = await Payment.findById(response.body._id);
	expect(dbPayment).toBeNull();
});

test("Should not create a payment for a reservation if payment error", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId: reservationIdTwo,
			token: "payment_error",
		})
		.expect(400);

	expect(response.error.text).toMatch(
		/Something went wrong with your transaction/
	);

	const dbPayment = await Payment.findById(response.body._id);
	expect(dbPayment).toBeNull();
});

test("Should not create a payment and should delete the reservation if number of retries exceeded", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId: reservationIdTwo,
			token: "payment_error",
		})
		.expect(400);

	expect(response.error.text).toMatch(
		/Something went wrong with your transaction/
	);

	const dbPayment = await Payment.findById(response.body._id);
	expect(dbPayment).toBeNull();
});

test("Should not create a payment for non-existing reservation", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId: wrongId,
			token: "payment_error",
		})
		.expect(404);

	expect(response.error.text).toMatch(/Could not find reservation/);

	const dbPayment = await Payment.findById(response.body._id);
	expect(dbPayment).toBeNull();
});
test("Should not create a payment and delete a reservation if paid after 15min passed", async () => {
	const response = await request(app)
		.post("/payment")
		.send({
			reservationId: reservationIdThree,
			token: "",
		})
		.expect(400);

	expect(response.error.text).toMatch(
		/Your reservation is no longer valid! Next time please finish payment within 15min/
	);

	const dbPayment = await Payment.findById(response.body._id);
	const dbReservation = await Reservation.findById(reservationIdThree);
	expect(dbPayment).toBeNull();
	expect(dbReservation).toBeNull();
});
afterAll(cleanupDB);

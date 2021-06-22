const request = require("supertest");
const app = require("../src/app");
const { Reservation } = require("../src/models/reservation");
const { insertEvent, eventId } = require("./fixtures/db");

beforeAll(insertEvent);

test("Should create a new reservation only if booking all the seats in a row", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 0,
			seats: { A: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
		})
		.expect(201);
	// console.log(response.error);
	const dbRes = await Reservation.findById(response.body.reservation._id);
	// Assertions about the response
	expect(response.body.reservation.isPaid).toEqual(dbRes.isPaid);
	expect(response.body.reservation.sellingOption).toEqual(dbRes.sellingOption);
	expect(response.body.reservation.ticketQuantity).toEqual(
		dbRes.ticketQuantity
	);
	expect(response.body.reservation.totalAmount).toEqual(dbRes.totalAmount);
});
test("Should create a new reservation only if booking even quantity of seats", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 2,
			seats: { B: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
		})
		.expect(201);
});
test("Should create a new reservation only if at least two seats are left empty in a row", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 1,
			seats: { C: [0, 1, 2, 3, 4, 5, 6, 7] },
		})
		.expect(201);
	// console.log(response.error);
});
test("Should return 400 if not booking all the seats in a row", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 0,
			seats: { D: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
		})
		.expect(400);
});
test("Should return 400 if one seat would be left empty in a row", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 1,
			seats: { D: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
		})
		.expect(201);
	// console.log(response.error);
});
test("Should return 400 when picked seats are reserved", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 2,
			seats: { A: [1, 2] },
		})
		.expect(400);
});

test("Should not reserve ticket if quantity of tickets is odd", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 2,
			seats: { B: [1, 2, 3] },
		})
		.expect(400);
});
test("Should return 404 if row does not exists", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 2,
			seats: { E: [1, 2, 3] },
		})
		.expect(404);
});
test("Should return 400 when wrong sellingOption passed", async () => {
	const response = await request(app)
		.post("/reservations")
		.send({
			eventId,
			sellingOption: 3,
			seats: { D: [1, 2] },
		})
		.expect(400);
});
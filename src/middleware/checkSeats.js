const Event = require("../models/event");
const { SellingOption } = require("../models/reservation");
const { BadRequestError, NotFoundError } = require("../util/customErrors");

const seatsCheck = async (req, res, next) => {
	const { eventId, seats, sellingOption } = req.body;
	let sellingOptionError;
	try {
		if (!Object.values(SellingOption).includes(sellingOption)) {
			throw new BadRequestError(
				"Please provide a proper selling option from range 0-2"
			);
		}

		const dbEvent = await Event.findById(eventId);

		if (!dbEvent)
			throw new NotFoundError(`Event with id: ${eventId} does not exists!`);

		let ticketQuantity = 0;

		for (let row in seats) {
			let actualRow = dbEvent.seatInfo.get(row);

			if (!actualRow)
				throw new NotFoundError(`Row ${row} does not exist in this event`);

			let numberOfSeats = actualRow.numberOfSeats;
			let reservedSeats = actualRow.reservedSeats;
			let seatsToReserve = seats[row];

			switch (true) {
				case sellingOption == SellingOption.ALL_TOGETHER &&
					numberOfSeats != seatsToReserve.length:
					sellingOptionError = "You have to book all the seats in a row.";
					break;
				case sellingOption == SellingOption.AVOID_ONE &&
					numberOfSeats - seatsToReserve == 1:
					sellingOptionError = "You cannot leave only one seat empty in a row.";
					break;
				case sellingOption == SellingOption.EVEN &&
					seatsToReserve.length % 2 != 0:
					sellingOptionError = "You cannot reserve odd number of seats.";
					break;
			}
			if (sellingOptionError) {
				throw new BadRequestError(sellingOptionError);
			}

			let reservedSeatsSet = new Set(reservedSeats);

			for (let i in seatsToReserve) {
				if (seatsToReserve[i] >= numberOfSeats) {
					throw new BadRequestError(
						"Please enter correct seat number. " +
							"Given seat number exceeds total number of seat in given row"
					);
				}
				if (reservedSeatsSet.has(seatsToReserve[i])) {
					throw new BadRequestError(
						`Seat number ${seatsToReserve[i]} is already reserved. Please try with some other seat!`
					);
				}
			}

			dbEvent.seatInfo.get(row).reservedSeats.push(...seatsToReserve);
			ticketQuantity += seatsToReserve.length;
		}

		await dbEvent.save();
		req.body.ticketQuantity = ticketQuantity;
		req.body.totalAmount = ticketQuantity * dbEvent.ticketPrice;

		next();
	} catch (err) {
		res.status(err.statusCode).send({
			error: `Request failed. ${err.message}`,
		});
	}
};

module.exports = seatsCheck;

const cron = require("node-cron");
let log = require("log4js").getLogger("ReservationReaper");
const { Reservation } = require("../models/reservation");

const startReaper = () => {
	cron.schedule("*/30 * * * *", async function () {
		log.info("---------------------");
		log.info("Resevation Reaper in action");
		const { deletedCount } = await Reservation.findOldAndReap();
		log.info(
			`Found and deleted ${deletedCount} invalid reservations at ${new Date()}`
		);
	});
};
module.exports = startReaper;

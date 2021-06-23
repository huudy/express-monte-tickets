const express = require("express");
require("./db/mongoose");
const paymentRouter = require("./routers/payment");
const reservationRouter = require("./routers/reservation");
const dbState = require("./middleware/dbState");
const log4js = require("log4js");
const startReaper = require("./cron/invalidTicketsReaper");
log4js.configure("./config/log4js.json");

let log = log4js.getLogger("app");
//this is only for testing purposes
if (process.env.DEV) {
	require("./util/seedDb");
}
const app = express();
app.use(
	log4js.connectLogger(log4js.getLogger("http"), {
		level: "auto",
	})
);
log.info("Setting up the application...");
app.use(dbState);
app.use(express.json());
app.use(reservationRouter);
app.use(paymentRouter);
startReaper();
module.exports = app;

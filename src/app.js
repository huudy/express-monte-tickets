const express = require("express");
require("./db/mongoose");
const paymentRouter = require("./routers/payment");
const reservationRouter = require("./routers/reservation");
const dbState = require("./middleware/dbState");
const log4js = require("log4js");
log4js.configure("./config/log4js.json");

let log = log4js.getLogger("app");

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

module.exports = app;

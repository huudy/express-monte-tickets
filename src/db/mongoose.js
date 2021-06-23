const mongoose = require("mongoose");
const log = require("log4js").getLogger("mongoose");

const db = mongoose.connection;
const connect = () => {
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		autoReconnect: process.env.AUTO_RECONNECT,
		useUnifiedTopology: process.env.UNIFIED_TOPOLOGY,
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

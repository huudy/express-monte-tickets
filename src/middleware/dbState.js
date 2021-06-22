let mongoose = require("mongoose");

const dbState = async (req, res, next) => {
	try {
		let mongoStatus = mongoose.connection.readyState;
		if (mongoStatus === 0 || mongoStatus === 3) {
			throw new Error(
				"Mongo DB connection lost! Please try again in a moment..."
			);
		}

		next();
	} catch (err) {
		res.status(500).send(err.message);
	}
};

module.exports = dbState;

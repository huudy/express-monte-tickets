let mongoose = require("mongoose");

let PaymentSchema = new mongoose.Schema(
	{
		reservation: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Reservation",
		},
	},
	{ timestamps: true }
);

let Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;

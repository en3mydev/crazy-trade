const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect("mongodb+srv://danielgheorghedev:LxBAhoWWcj0BX5M0@cluster0.fgwbsrb.mongodb.net/accounts")
  .then(() => {
    console.log("Connected to the database");
  })
  .catch(() => {
    console.log("Failed to connect to the database");
  });

const customerSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  balance: Number,
  transactions: [
    {
      type: {
        type: String,
        enum: ["deposit", "withdrawal", "other"], // Add any other transaction types you may have
      },
      amount: Number,
      date: Date,
      coinId: String, // Add properties related to the transfer (optional, adjust based on your needs)
      cryptoValue: Number,
    },
  ],
  crypto: [
    {
      coinId: String,
      amount: Number,
    },
  ],
});

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer", // Reference to the "customers" collection
  },
  type: {
    type: String,
    enum: ["buy", "sell"],
  },
  amount: Number,
  date: Date,
  coinId: String,
  cryptoValue: Number,
});

const Customer = mongoose.model("Customer", customerSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = {
  Customer,
  Transaction,
};
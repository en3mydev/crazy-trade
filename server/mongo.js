const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URL)
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
        enum: ["deposit", "withdrawal", "other"],
      },
      amount: Number,
      date: Date,
      coinId: String,
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
    ref: "Customer",
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
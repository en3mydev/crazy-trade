const express = require("express");
const cors = require("cors");
const { Customer, Transaction } = require("./mongo");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://crazy-trade-frontend.vercel.app/",
    methods: ["POST", "GET"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const existingUser = await Customer.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  const data = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    balance: 0,
  };

  try {
    await Customer.insertMany([data]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const generateAuthToken = (user) => {
  const token = jwt.sign({ userId: user._id }, "secret_key", {
    expiresIn: "1h",
  });
  return token;
};

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Customer.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generare token pentru autentificare
  const token = generateAuthToken(user);

  res.status(200).json({ token, userId: user._id }); // returnează doar userId în loc de user
});

app.get("/user/:id", async (req, res) => {
  const userId = req.params.id;

  const user = await Customer.findOne({ _id: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

app.post("/deposit", async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const user = await Customer.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedBalance = user.balance + parseFloat(amount);

    // Actualizează soldul utilizatorului în baza de date
    await Customer.updateOne(
      { _id: userId },
      { $set: { balance: updatedBalance } }
    );

    // Adaugă o înregistrare în istoricul tranzacțiilor
    user.transactions.push({
      type: "deposit", // Specify a valid transaction type
      amount: parseFloat(amount),
      date: new Date(),
    });

    // Salvare document actualizat
    await user.save();

    res
      .status(200)
      .json({ message: "Deposit successful", balance: updatedBalance });
  } catch (error) {
    console.error("Error depositing money:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/transfer", async (req, res) => {
  const { amount, userId, transferType, coinId, cryptoValue } = req.body;

  try {
    const user = await Customer.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (transferType === "buy") {
      const updatedBalance = user.balance - parseFloat(amount);
      if (updatedBalance < 0) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      const existingCrypto = user.crypto.find((c) => c.coinId === coinId);

      if (existingCrypto) {
        existingCrypto.amount += cryptoValue;
      } else {
        user.crypto.push({ coinId, amount: cryptoValue });
      }

      const userUpdate = {
        $set: { balance: updatedBalance, crypto: user.crypto },
      };

      await Customer.updateOne({ _id: userId }, userUpdate);

      await Transaction.create({
        userId,
        type: "buy",
        amount: parseFloat(amount),
        date: new Date(),
        coinId,
        cryptoValue,
      });

      res
        .status(200)
        .json({ message: "Buy successful", balance: updatedBalance });
    } else if (transferType === "sell") {
      const existingCrypto = user.crypto.find((c) => c.coinId === coinId);
      if (!existingCrypto || existingCrypto.amount < cryptoValue) {
        return res.status(400).json({ message: "Insufficient funds" });
      }

      if (existingCrypto.amount === cryptoValue) {
        // Remove the cryptocurrency from the user's assets if the remaining amount is zero
        user.crypto = user.crypto.filter((c) => c.coinId !== coinId);
      }

      const updatedBalance = user.balance + parseFloat(amount);
      const updatedCrypto = user.crypto.map((c) => {
        if (c.coinId === coinId) {
          c.amount -= cryptoValue;
        }
        return c;
      });

      const userUpdate = {
        $set: { balance: updatedBalance, crypto: updatedCrypto },
      };

      await Customer.updateOne({ _id: userId }, userUpdate);

      await Transaction.create({
        userId,
        type: "sell",
        amount: parseFloat(amount),
        date: new Date(),
        coinId,
        cryptoValue,
      });

      res
        .status(200)
        .json({ message: "Sell successful", balance: updatedBalance });
    } else {
      return res.status(400).json({ message: "Invalid transfer type" });
    }
  } catch (error) {
    console.error("Error transferring money:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/withdraw", async (req, res) => {
  const { amount, userId } = req.body;

  try {
    const user = await Customer.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedBalance = user.balance - parseFloat(amount);

    // Actualizează soldul utilizatorului în baza de date
    await Customer.updateOne(
      { _id: userId },
      { $set: { balance: updatedBalance } }
    );

    // Adaugă o înregistrare în istoricul tranzacțiilor
    user.transactions.push({
      type: "withdrawal", // Specify a valid transaction type
      amount: parseFloat(amount),
      date: new Date(),
    });

    // Salvare document actualizat
    await user.save();

    res
      .status(200)
      .json({ message: "Withdraw successful", balance: updatedBalance });
  } catch (error) {
    console.error("Error depositing money:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/trade-history/:userId", async (req, res) => {
  const userId = req.params.id;

  const user = await Transaction.find({ ObjectId: userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

app.post("/changepassword", async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    const user = await Customer.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Customer.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } }
    );

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
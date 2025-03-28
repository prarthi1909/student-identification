const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected Successfully!");
}).catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err);
});

// Define Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User = mongoose.model("User", UserSchema);

// Signup API
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.json({ message: "Signup Successful!" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
});

// ✅ Root Route Test (Health Check)
app.get("/", (req, res) => {
    res.send("Hello, server is running!");
});

// ✅ Server Start Message
app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});

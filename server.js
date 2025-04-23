const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const bcrypt    = require("bcryptjs");
const validator = require("validator");
const path      = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static files from root (e.g., index.html, style.css)
app.use(express.static(path.join(__dirname)));

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully!");
  console.log("🌐 Visit your site at: http://localhost:5000");
})
.catch(err => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// ✅ Import Course Model
const Course = require("./course"); // Make sure course.js is in same folder

// ✅ User Schema with Course Field
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  course:   { type: String }
});
const User = mongoose.model("User", UserSchema);

// 🔹 Course APIs
app.post("/courses", async (req, res) => {
  const { name, duration, department } = req.body;
  try {
    const course = new Course({ name, duration, department });
    await course.save();
    res.status(201).json({ message: "✅ Course added!", course });
  } catch (err) {
    res.status(400).json({ message: "❌ Failed to add course", error: err.message });
  }
});

app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// 🔹 Signup API
app.post("/signup", async (req, res) => {
  const { name, email, password, course } = req.body;

  try {
    if (!name || !email || !password || !course)
      return res.status(400).json({ message: "⚠️ All fields are required!" });
    if (!validator.isEmail(email))
      return res.status(400).json({ message: "⚠️ Invalid email format!" });
    if (password.length < 6)
      return res.status(400).json({ message: "⚠️ Password must be at least 6 characters long!" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "⚠️ Email already in use!" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hash, course });
    await newUser.save();

    res.status(201).json({ message: "✅ Signup Successful! You can now log in." });
  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "❌ Error signing up, please try again." });
  }
});

// 🔹 Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "⚠️ Email and password are required!" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "⚠️ User not found! Please sign up first." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(400).json({ message: "❌ Incorrect password!" });

    res.status(200).json({
      message: "✅ Login successful!",
      user: { id: user._id, name: user.name, email: user.email, course: user.course }
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "❌ Error logging in, please try again." });
  }
});

// ✅ Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
  console.log("🌐 Visit your site at: http://localhost:" + PORT);
});

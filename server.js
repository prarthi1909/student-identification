const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const bcrypt    = require("bcryptjs");
const validator = require("validator");
const path      = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static files (index.html etc.)
app.use(express.static(path.join(__dirname)));

// ✅ MongoDB Connection
mongoose.connect("mongodb://localhost:27017/studentDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected Successfully!");
})
.catch(err => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// ✅ Import Course Model
const Course = require("./course");

// ✅ User Schema with Role & Course
const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role:     { type: String, required: true },
  course:   { type: String } // optional for teacher
});
const User = mongoose.model("User", UserSchema);

// 🔹 POST /signup
app.post("/signup", async (req, res) => {
  const { name, email, password, role, course } = req.body;

  // ✅ Validation
  if (!name || !email || !password || !role || (role === "student" && !course)) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, course });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 POST /login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    res.status(200).json({
      message: "Login successful!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Course APIs
app.post("/courses", async (req, res) => {
  const { name, duration, department } = req.body;
  try {
    const course = new Course({ name, duration, department });
    await course.save();
    res.status(201).json({ message: "Course added!", course });
  } catch (err) {
    res.status(400).json({ message: "Failed to add course", error: err.message });
  }
});

app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// ✅ Home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});

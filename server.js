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
  insertDefaultCourses(); // Insert courses after DB connected
})
.catch(err => {
  console.error("❌ MongoDB Connection Failed:", err);
});

// ✅ Course Schema & Model
const courseSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  duration:   { type: String },
  department: { type: String }
});
const Course = mongoose.model("Course", courseSchema);

// ✅ Insert default courses if not present
async function insertDefaultCourses() {
  const count = await Course.countDocuments();
  if (count === 0) {
    const courses = [
      { name: "BCA", duration: "3 Years", department: "Computer Science" },
      { name: "B.Tech", duration: "4 Years", department: "Engineering" },
      { name: "MCA", duration: "2 Years", department: "Computer Science" },
      { name: "MBA", duration: "2 Years", department: "Business Administration" }
    ];
    await Course.insertMany(courses);
    console.log("✅ Default courses added to database.");
  }
}

// ✅ User Schema with Role & Course
const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:   { type: String, required: true },
  role:       { type: String, required: true },
  course:     { type: String },
  rollNumber: { type: String, required: true, unique: true },
  marks:      { type: Number, default: null },
  attendance: { type: Number, default: 0 }
});
const User = mongoose.model("User", UserSchema);

// 🔹 POST /signup
app.post("/signup", async (req, res) => {
  const { name, email, password, role, course, rollNumber } = req.body;

  if (!name || !email || !password || !role || !rollNumber || (role === "student" && !course)) {
    return res.status(400).json({ message: "Please fill all required fields." });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { rollNumber }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role, course, rollNumber });
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
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        course: user.course,
        rollNumber: user.rollNumber
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 GET /students - fetch students (updated to include email)
app.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("name email rollNumber course marks attendance");
    res.status(200).json(students);
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ message: "Failed to fetch students." });
  }
});

// 🔹 POST /marks - Add or update marks by roll number
app.post("/marks", async (req, res) => {
  const { rollNumber, marks } = req.body;
  try {
    const student = await User.findOne({ rollNumber, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.marks = marks;
    await student.save();

    res.status(200).json({ message: "Marks updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update marks" });
  }
});

// 🔹 POST /attendance - Add or update attendance by roll number
app.post("/attendance", async (req, res) => {
  const { rollNumber, attendance } = req.body;
  try {
    const student = await User.findOne({ rollNumber, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    student.attendance = attendance;
    await student.save();

    res.status(200).json({ message: "Attendance updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update attendance" });
  }
});

// 🔹 GET /student/:rollNumber - Get student by roll number
app.get("/student/:rollNumber", async (req, res) => {
  const rollNumber = req.params.rollNumber;
  try {
    const student = await User.findOne({ rollNumber, role: "student" });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Error fetching student data" });
  }
});

// 🔹 GET /courses - List all courses
app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// ✅ Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});

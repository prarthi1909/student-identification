document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (res.ok) {
      // ✅ Role-based redirect
      if (result.user.role === "student") {
        window.location.href = "student-dashboard.html";
      } else if (result.user.role === "teacher") {
        window.location.href = "teacher-dashboard.html";
      } else {
        alert("Unknown role. Please contact admin.");
      }
    } else {
      alert("Login failed: " + result.message);
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Something went wrong. Try again.");
  }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const user = await res.json();
  
      if (res.ok) {
        // Role-based redirect
        if (user.role === "student") {
          window.location.href = "student-dashboard.html";
        } else if (user.role === "teacher") {
          window.location.href = "teacher-dashboard.html";
        }
      } else {
        alert("Login failed: " + user.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong.");
    }
  });
  
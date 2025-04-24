document.getElementById("role").addEventListener("change", function () {
    const courseField = document.getElementById("course");
    const rollNumberField = document.getElementById("rollNumber");

    if (this.value === "student") {
        courseField.style.display = "block";
        rollNumberField.style.display = "block";
    } else {
        courseField.style.display = "none";
        rollNumberField.style.display = "none";
    }
});

document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent page refresh

    // Get and trim form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;
    const course = document.getElementById("course").value;
    const rollNumber = document.getElementById("rollNumber").value.trim();

    // Validation: Required fields
    if (!name || !email || !password || !role) {
        alert("⚠️ Please fill all the required fields.");
        return;
    }

    // If student, course and roll number must be present
    if (role === "student") {
        if (!course) {
            alert("⚠️ Please select a course for student role.");
            return;
        }
        if (!rollNumber) {
            alert("⚠️ Please enter Roll Number for student.");
            return;
        }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("⚠️ Please enter a valid email address.");
        return;
    }

    // Password length validation
    if (password.length < 6) {
        alert("⚠️ Password must be at least 6 characters long.");
        return;
    }

    // Show loading state
    const submitButton = document.querySelector("#signupForm button");
    submitButton.innerText = "Signing Up...";
    submitButton.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                password,
                role,
                course: role === "student" ? course : null,
                rollNumber: role === "student" ? rollNumber : null
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ " + data.message);

            // Clear form
            document.getElementById("signupForm").reset();

            // Redirect
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            alert("❌ " + data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Signup failed! Please try again.");
    } finally {
        // Restore button
        submitButton.innerText = "Sign Up";
        submitButton.disabled = false;
    }
});

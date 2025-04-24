document.getElementById("role").addEventListener("change", function () {
    const courseField = document.getElementById("course");
    if (this.value === "student") {
        courseField.style.display = "block";
    } else {
        courseField.style.display = "none";
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

    // Validation: Required fields
    if (!name || !email || !password || !role) {
        alert("⚠️ Please fill all the required fields.");
        return;
    }

    // If role is student, course must be selected
    if (role === "student" && !course) {
        alert("⚠️ Please select a course for student role.");
        return;
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
                course: role === "student" ? course : null
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

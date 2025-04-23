document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Page refresh hone se rokta hai

    // Get and trim form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!name || !email || !password) {
        alert("⚠️ Please fill all the fields.");
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

    // Optional: change button text to show loading state
    const submitButton = document.querySelector("#signupForm button");
    submitButton.innerText = "Signing Up...";
    submitButton.disabled = true;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("✅ " + data.message); // Signup success message

            // Clear form after successful signup
            document.getElementById("signupForm").reset();

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            alert("❌ " + data.message); // Show error message if signup fails
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Signup failed! Please try again.");
    } finally {
        // Revert button text back and enable it
        submitButton.innerText = "Sign Up";
        submitButton.disabled = false;
    }
});

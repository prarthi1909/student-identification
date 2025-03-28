document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Page refresh hone se rokta hai

    // Get and trim form values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Basic validation
    if (!name || !email || !password) {
        alert("Please fill all the fields.");
        return;
    }

    // Optional: change button text to show loading state
    const submitButton = document.querySelector("#signupForm button");
    submitButton.innerText = "Signing Up...";

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        alert(data.message); // Signup success ya error message dikhayega

        // Optional: clear form on success
        if (data.message === "Signup Successful!") {
            document.getElementById("signupForm").reset();
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Signup failed! Try again.");
    } finally {
        // Revert button text back
        submitButton.innerText = "Sign Up";
    }
});

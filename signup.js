document.getElementById("signupForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Page refresh hone se rokta hai

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        alert(data.message); // Signup success ya error message dikhayega

    } catch (error) {
        console.error("Error:", error);
        alert("Signup failed! Try again.");
    }
});

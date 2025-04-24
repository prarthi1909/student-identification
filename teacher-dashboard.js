document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user || user.role !== "teacher") {
      alert("Unauthorized access!");
      window.location.href = "login.html";
      return;
    }
  
    const welcomeMsg = document.createElement("h2");
    welcomeMsg.textContent = `Welcome, ${user.name}!`;
    document.body.insertBefore(welcomeMsg, document.body.children[1]);
  });
  
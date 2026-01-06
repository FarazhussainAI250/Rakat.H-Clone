const USER_KEY = "voiceAppUser";

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("form");
  const userInput = document.getElementById("user");
  const passInput = document.getElementById("pass");
  const formErr = document.getElementById("formErr");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    
    const email = userInput.value.trim().toLowerCase();
    const password = passInput.value;

    // Check if admin credentials
    if (checkAdminLogin(email, password)) {
      window.location.replace("admin-dashboard.html");
      return;
    }
    
    // Regular user login
    if (email === "voiceappauth@gmail.com" && password === "VoiceApp@123") {
      localStorage.setItem(USER_KEY, JSON.stringify({email: email, initials: "V"}));
      window.location.replace("index.html");
    } else {
      formErr.textContent = "Incorrect email or password.";
      formErr.style.color = "red";
    }
  });
});

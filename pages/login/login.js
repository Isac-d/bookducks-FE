const eyeButtons = document.querySelectorAll(".toggle-password");

const handleShowPassword = (event) => {
  const button = event.currentTarget;
  const container = button.closest(".input-container");
  const input = container.querySelector(".password-input");

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  button.classList.toggle("fa-eye", !isHidden);
  button.classList.toggle("fa-eye-slash", isHidden);
};

eyeButtons.forEach((button) =>
  button.addEventListener("click", handleShowPassword)
);

const loginUser = async (userData) => {
  try {
    const response = await fetch("http://localhost:1337/api/auth/local", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error?.message || "Login failed. Please try again.";
      alert(`Error: ${errorMessage}`);
      console.error("Login failed:", data);
      return null;
    }

    if (data.jwt) {
      localStorage.setItem("token", data.jwt);
      console.log("User logged in:", data);
      return data;
    }

    alert("Unexpected error occurred. Please try again.");
    return null;

  } catch (error) {
    console.error("Network or server error:", error);
    alert("Network error. Please check your connection or try again later.");
    return null;
  }
};

const handleLogin = async () => {
  const usernameInput = document.querySelector(".username-input").value;
  const passwordInput = document.querySelector(".password-input").value;

  if (usernameInput === "" || passwordInput === "") {
    alert('Please fill in all fields');
    return;
  }

  const userData = {
    identifier: usernameInput,
    password: passwordInput,
  };

  const loginResult = await loginUser(userData);
  if (loginResult) {
    window.location.href = "../../index.html";
  }
};


const logInButton = document.querySelector(".login-button");
logInButton.addEventListener("click", handleLogin);

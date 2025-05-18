import { handleShowPassword } from "../../utlils/showPassword.js";
import { isUserSignedIn } from "../../utlils/isUserSignedIn.js";
const eyeButtons = document.querySelectorAll(".toggle-password");
const BASE_URL = "http://localhost:1337";
if(isUserSignedIn()){
  window.location.href = '../../index.html'
}

eyeButtons.forEach((button) =>
  button.addEventListener("click", handleShowPassword)
);

const loginUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/local`, {
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

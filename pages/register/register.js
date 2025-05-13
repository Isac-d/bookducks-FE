import { handleShowPassword } from "../../utlils/showPassword.js";

const BASE_URL = "http://localhost:1337";

const registerButton = document.querySelector(".login-button.register");

const eyeButtons = document.querySelectorAll(".toggle-password");

eyeButtons.forEach((button) =>
  button.addEventListener("click", handleShowPassword)
);

const registerUser = async (userData) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.error?.message || "Registration failed. Please try again.";
      alert(`Error: ${errorMessage}`);
      console.error("Registration error:", data);
      return null;
    }

    if (data.jwt) {
      localStorage.setItem("token", data.jwt);
      console.log("User registered:", data);
      window.location.href = "../../index.html";
      return data;
    }

    alert("Unexpected registration error. Please try again.");
    return null;
  } catch (error) {
    console.error("Network or server error:", error);
    alert("Network error. Please check your connection or try again later.");
    return null;
  }
};

const handleRegister = async () => {
  const email = document.querySelector(".email-input.register").value;
const username = document.querySelector(".username-input.register").value;
const password = document.querySelector(".password-input.register").value;
const repeatPassword = document.querySelector(
  ".repeat-password-input.register"
).value;
  console.log(username, password, email, repeatPassword)
  if (
    username === "" ||
    password === "" ||
    email === "" ||
    repeatPassword === ""
  ) {
    alert("Please fill in all fields");
    return;
  }
  if (password !== repeatPassword) {
    alert("Passwords does not match!");
    return;
  }
  const userData = {
    username,
    email,
    password,
  };

  await registerUser(userData);
};

registerButton.addEventListener("click", handleRegister);

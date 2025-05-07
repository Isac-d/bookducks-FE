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
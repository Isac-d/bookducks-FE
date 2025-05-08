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

  async function loginUser() {
    try {
      const response = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: 'testUser',
          password: 'test123',
        }),
      });
  
      const data = await response.json();
      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
      }  
  
      if (!response.ok) {
        console.error('Login failed:', data);
        return;
      }
  
      console.log('User logged in:', data);
    } catch (error) {
      console.error('Network or server error:', error);
    }
  }
  
  loginUser();
  
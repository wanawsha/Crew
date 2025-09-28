import { API_AUTH } from "../api/config.js";

const form = document.querySelector("#register-form");
const errorBox = document.querySelector("#register-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const formData = new FormData(form);
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

try {
    const res = await fetch(`${API_AUTH}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Registration failed");
    }

    alert("User registered! You can now log in.");
    window.location.href = "./login.html";
  } catch (err) {
    errorBox.textContent = err.message;
  }
});


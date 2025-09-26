import { API_AUTH } from "../api/config.js";

const form = document.querySelector("#login-form");
const errorBox = document.querySelector("#login-error");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.textContent = "";

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // Login request
    const res = await fetch(`${API_AUTH}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Login response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Login failed");
    }

    // Extract token & profile
    const token = data.data.accessToken;
    const profile = data.data;

    // Save token + profile
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    const resKey = await fetch(`${API_AUTH}/create-api-key`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const keyData = await resKey.json();
    console.log("API Key response:", keyData);

    if (!resKey.ok) {
      throw new Error(keyData.errors?.[0]?.message || "Failed to create API key");
    }

    // Save API Key
    const apiKey = keyData.data.key;
    localStorage.setItem("apiKey", apiKey);

    // Redirect to feed page
    window.location.href = "./feed.html";
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Login error:", err);
  }
});

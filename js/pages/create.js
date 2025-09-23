import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const form = document.querySelector("#create-form");
const errorBox = document.querySelector("#create-error");
const logoutBtn = document.querySelector("#logout");

// 🔹 Redirect if not logged in
if (!token || !apiKey) {
  window.location.href = "./login.html";
}

// 🔹 Logout
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// 🔹 Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const formData = new FormData(form);
  const title = formData.get("title");
  const body = formData.get("body");

  try {
    const res = await fetch(`${API_SOCIAL}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    const data = await res.json();
    console.log("Create post response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to create post");
    }

    // ✅ Redirect to feed after creating
    window.location.href = "./feed.html";
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Create post error:", err);
  }
});

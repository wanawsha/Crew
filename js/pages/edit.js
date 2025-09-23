import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const form = document.querySelector("#edit-form");
const errorBox = document.querySelector("#edit-error");
const logoutBtn = document.querySelector("#logout");

// Redirect if not logged in
if (!token || !apiKey) {
  window.location.href = "./login.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// Get post ID from URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

// Load existing post
async function loadPost() {
  try {
    const res = await fetch(`${API_SOCIAL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load post");
    }

    form.title.value = data.data.title || "";
    form.body.value = data.data.body || "";
  } catch (err) {
    errorBox.textContent = err.message;
  }
}

// Handle update
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const title = form.title.value;
  const body = form.body.value;

  try {
    const res = await fetch(`${API_SOCIAL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to update post");
    }

    // Redirect back to feed
    window.location.href = "./feed.html";
  } catch (err) {
    errorBox.textContent = err.message;
  }
});

loadPost();

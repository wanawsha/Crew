import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const postContainer = document.querySelector("#post-container");
const errorBox = document.querySelector("#post-error");
const logoutBtn = document.querySelector("#logout");

// 🔹 Redirect if not logged in
if (!token || !apiKey) {
  window.location.href = "./login.html";
}

// 🔹 Logout button
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// 🔹 Get post ID from URL (?id=123)
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId) {
  errorBox.textContent = "No post ID provided.";
} else {
  getPost(postId);
}

// 🔹 Fetch a single post
async function getPost(id) {
  try {
    const res = await fetch(`${API_SOCIAL}/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    console.log("Single post response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load post");
    }

    renderPost(data.data);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Post error:", err);
  }
}

// 🔹 Render post details
function renderPost(post) {
  postContainer.innerHTML = `
    <div class="post-card">
      <h2>${post.title || "Untitled Post"}</h2>
      <p>${post.body || ""}</p>
      <small>By: ${post.author?.name || "Unknown"}</small>
      <br>
      <p><strong>Created:</strong> ${new Date(post.created).toLocaleString()}</p>
      <p><strong>Updated:</strong> ${new Date(post.updated).toLocaleString()}</p>
    </div>
  `;
}

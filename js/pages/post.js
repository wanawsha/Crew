import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const postContainer = document.querySelector("#post-container");
const errorBox = document.querySelector("#post-error");
const logoutBtn = document.querySelector("#logout");

if (!token || !apiKey) {
  window.location.href = "./login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId) {
  errorBox.textContent = "No post ID provided.";
} else {
  getPost(postId);
}

// Fetch a single post
async function getPost(id) {
  try {
    const res = await fetch(`${API_SOCIAL}/posts/${id}?_author=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load post");
    }

    renderPost(data.data);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Post error:", err);
  }
}


// Render post details
function renderPost(post) {
postContainer.innerHTML = `
  <div class="post-card flex flex-col space-y-4">
    <h2 class="text-xl font-bold mb-4">${post.title || "Untitled Post"}</h2>
    <p>${post.body || ""}</p>
    <small>By: 
      <a href="./profile.html?name=${post.author?.name}">
        ${post.author?.name || "Unknown"}
      </a>
    </small>
    <p><strong>Created:</strong> ${new Date(post.created).toLocaleString()}</p>
    <p><strong>Updated:</strong> ${new Date(post.updated).toLocaleString()}</p>
  </div>
`;
}

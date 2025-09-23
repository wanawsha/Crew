import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const userProfile = JSON.parse(localStorage.getItem("userProfile"));

const profileInfo = document.querySelector("#profile-info");
const postsContainer = document.querySelector("#my-posts-container");
const errorBox = document.querySelector("#profile-error");
const logoutBtn = document.querySelector("#logout");

// 🔹 Redirect if not logged in
if (!token || !apiKey || !userProfile) {
  window.location.href = "./login.html";
}

// 🔹 Logout
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// 🔹 Display profile info
profileInfo.innerHTML = `
  <p><strong>Name:</strong> ${userProfile.name}</p>
  <p><strong>Email:</strong> ${userProfile.email}</p>
`;

// 🔹 Fetch my posts
async function getMyPosts() {
  try {
    const res = await fetch(
      `${API_SOCIAL}/profiles/${userProfile.name}/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    const data = await res.json();
    console.log("My posts response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load posts");
    }

    renderPosts(data.data);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Profile error:", err);
  }
}

// 🔹 Render my posts
function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>You haven't created any posts yet.</p>";
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <h3>${post.title || "Untitled Post"}</h3>
      <p>${post.body || ""}</p>
      <small>Created: ${new Date(post.created).toLocaleString()}</small>
      <br>
      <a href="./post.html?id=${post.id}">View</a>
      <a href="./edit.html?id=${post.id}">Edit</a>
      <button class="delete-btn" data-id="${post.id}">Delete</button>
    `;

    postsContainer.appendChild(card);
  });

  // Add delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deletePost(btn.dataset.id));
  });
}

// 🔹 Delete post
async function deletePost(id) {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${API_SOCIAL}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors?.[0]?.message || "Failed to delete post");
    }

    getMyPosts(); // Refresh after deleting
  } catch (err) {
    alert(err.message);
  }
}

// Load my posts
getMyPosts();

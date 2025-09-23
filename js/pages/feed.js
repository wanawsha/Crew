import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const postsContainer = document.querySelector("#posts-container");
const errorBox = document.querySelector("#feed-error");
const logoutBtn = document.querySelector("#logout");

// 🔹 If not logged in, redirect to login page
if (!token || !apiKey) {
  console.warn("Missing token or apiKey → redirecting to login.");
  window.location.href = "./login.html";
}

// 🔹 Logout button
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// 🔹 Fetch all posts
async function getPosts() {
  try {
    console.log("Fetching posts with:", { token, apiKey });

    const res = await fetch(`${API_SOCIAL}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    console.log("Posts response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load posts");
    }

    renderPosts(data.data); // ✅ only posts array
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Feed error:", err);
  }
}

// 🔹 Render posts
function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  const user = JSON.parse(localStorage.getItem("userProfile"));
  const currentUser = user?.name;

  posts.forEach((post) => {
    const card = document.createElement("div");
    card.className = "post-card";

    card.innerHTML = `
      <h3>${post.title || "Untitled Post"}</h3>
      <p>${post.body || ""}</p>
      <small>By: ${post.author?.name || "Unknown"}</small>
      <br>
      <a href="./post.html?id=${post.id}">View Post</a>
    `;

    // Show edit/delete only if current user owns the post
    if (post.author?.name === currentUser) {
      const editLink = document.createElement("a");
      editLink.href = `./edit.html?id=${post.id}`;
      editLink.textContent = "Edit";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deletePost(post.id));

      card.appendChild(document.createElement("br"));
      card.appendChild(editLink);
      card.appendChild(deleteBtn);
    }

    postsContainer.appendChild(card);
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

    getPosts(); // refresh feed
  } catch (err) {
    alert(err.message);
  }
}

// 🔹 Load posts when page loads
getPosts();

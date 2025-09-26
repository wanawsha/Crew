import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const postsContainer = document.querySelector("#posts-container");
const errorBox = document.querySelector("#feed-error");
const logoutBtn = document.querySelector("#logout");

// If not logged in, redirect to login page
if (!token || !apiKey) {
  console.warn("Missing token or apiKey → redirecting to login.");
  window.location.href = "./login.html";
}

// Logout button
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// Fetch all posts
async function getPosts() {
  try {
    console.log("Fetching posts with:", { token, apiKey });

const res = await fetch(`${API_SOCIAL}/posts?_author=true`, {
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

function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found.</p>";
    return;
  }

  const user = JSON.parse(localStorage.getItem("userProfile"));
  const currentUser = user?.name;

  posts.forEach((post) => {
    const title = post?.title || "Untitled Post";
    const body = post?.body || "";
    const authorName = post?.author?.name || "Unknown";

    console.log("Rendering post:", { id: post.id, title, authorName });

    const card = document.createElement("div");
    card.className = "post-card";

    // Content
    card.innerHTML = `
      <h3>${title}</h3>
      <p>${body}</p>
      <small>By: <a href="./profile.html?name=${authorName}">${authorName}</a></small>
      <br>
      <a href="./post.html?id=${post.id}">View Post</a>
    `;

    // Add default inline styles to make posts visible
    card.style.border = "1px solid #ccc";
    card.style.background = "white";
    card.style.color = "black";
    card.style.padding = "10px";
    card.style.margin = "10px 0";
    card.style.borderRadius = "6px";

    // Show edit/delete only if current user owns the post
    if (authorName === currentUser) {
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

  console.log("Final HTML inside posts-container:", postsContainer.innerHTML);
}



// Delete post
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

// Load posts when page loads
getPosts();


const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

// Search handler
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();

  if (!query) return getPosts(); // if empty, reload normal feed

  try {
    // 🔹 Fetch ALL posts instead of filtering at API level
    const res = await fetch(`${API_SOCIAL}/posts?limit=100`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    console.log("All posts before filtering:", data.data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load posts for search");
    }

    // Filter locally
    const filtered = data.data.filter((post) => {
      const title = (post?.title || "").toLowerCase().trim();
      const body = (post?.body || "").toLowerCase().trim();
      return title.includes(query) || body.includes(query);
    });

    console.log("Filtered posts:", filtered);
    renderPosts(filtered);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Search error:", err);
  }
});


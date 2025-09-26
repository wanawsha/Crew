import { API_SOCIAL } from "../api/config.js";

const token = localStorage.getItem("accessToken");
const apiKey = localStorage.getItem("apiKey");
const currentUser = JSON.parse(localStorage.getItem("userProfile"));

const profileInfo = document.querySelector("#profile-info");
const postsContainer = document.querySelector("#profile-posts");
const errorBox = document.querySelector("#profile-error");
const followBtn = document.querySelector("#follow-btn");
const logoutBtn = document.querySelector("#logout");

// Redirect if not logged in
if (!token || !apiKey || !currentUser) {
  window.location.href = "./login.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "./login.html";
});

// Which profile to view? (own or other)
const params = new URLSearchParams(window.location.search);
const profileName = params.get("name") || currentUser.name;

// Fetch profile info + posts
async function getProfile() {
  try {
    const res = await fetch(`${API_SOCIAL}/profiles/${profileName}?_followers=true&_following=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    console.log("Profile response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load profile");
    }

    renderProfile(data.data);
    getUserPosts(profileName);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Profile error:", err);
  }
}

// Render profile info + follow/unfollow button
function renderProfile(profile) {
  profileInfo.innerHTML = `
    <p><strong>Name:</strong> ${profile.name}</p>
    <p><strong>Email:</strong> ${profile.email}</p>
    <p><strong>Followers:</strong> ${profile._count?.followers ?? 0}</p>
    <p><strong>Following:</strong> ${profile._count?.following ?? 0}</p>
  `;

  // If it's your own profile, hide follow button
  if (profile.name === currentUser.name) {
    followBtn.style.display = "none";
    return;
  }

  // Show follow/unfollow button
  const isFollowing = profile.followers?.some((f) => f.name === currentUser.name);
  followBtn.textContent = isFollowing ? "Unfollow" : "Follow";

  followBtn.onclick = () => toggleFollow(profile.name, isFollowing);
}

// Follow / Unfollow a user
async function toggleFollow(username, isFollowing) {
  try {
    const url = `${API_SOCIAL}/profiles/${username}/${isFollowing ? "unfollow" : "follow"}`;
    const method = isFollowing ? "DELETE" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.errors?.[0]?.message || "Failed to toggle follow");
    }

    getProfile(); 
  } catch (err) {
    alert(err.message);
  }
}

// Fetch posts for this profile
async function getUserPosts(username) {
  try {
    const res = await fetch(`${API_SOCIAL}/profiles/${username}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    const data = await res.json();
    console.log("User posts response:", data);

    if (!res.ok) {
      throw new Error(data.errors?.[0]?.message || "Failed to load posts");
    }

    renderPosts(data.data);
  } catch (err) {
    errorBox.textContent = err.message;
    console.error("Posts error:", err);
  }
}

// 🔹 Render posts
function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    postsContainer.innerHTML = "<p>No posts found for this user.</p>";
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
    `;

    // If it's your post → show edit/delete
    if (profileName === currentUser.name) {
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

    getUserPosts(currentUser.name); 
  } catch (err) {
    alert(err.message);
  }
}

// Load profile on page load
getProfile();

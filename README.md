## Note on Follow/Unfollow‼️

This project implements the Follow feature using the Noroff Social API v2.
Following a user works as expected using PUT /social/profiles/{name}/follow.
However, Unfollow is not currently supported by the API:
Attempts with DELETE /social/profiles/{name}/follow return Route not found.
Using PUT again returns: “You are already following this profile”.
How this project handles it:
Users can follow other profiles.
If a user is already following a profile, the UI displays “Following ✓” and disables the button.
The unfollow option is disabled, and this limitation is documented here.


# Social Media Platform

A front-end client for the [Noroff Social API v2](https://docs.noroff.dev/docs/v2/social/posts).
Built using **HTML, CSS, and Vanilla Javascript (ES6 Modules)**.

---

## Live Demo -> https://wanawsha.github.io/Crew/index.html 

---

## Features
- Register a new user  
- Login / Logout with JWT Auth  
- View all posts (global feed)  
- View a single post with author details  
- Create, Edit, and Delete your own posts  
- Search posts by title/body  
- View user profiles and their posts  
- Follow / Unfollow other users 

---

## Project Structure
/ (root)
index.html
pages/
  login.html
  register.html
  feed.html
  profile.html
  post.html
  create.html
js/
  api/config.js
  pages/
    login.js
    register.js
    feed.js
    profile.js
    post.js
    create.js
css/
  styles.css
  feed.css
  create.css
  edit.css
  index.css
  login-register.css
  post.css
  profile.css

---

## Tech Stack
- HTML
- CSS3 + Tailwind CSS
- Javascript (ES6 Modules)
- Noroff API v2

---

## Setup and Run
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Start Tailwind in watch mode
   ```bash
   npm run dev
   ```
4. Open index.html in your browser

## Authentication and Local Storage
When a user logs in, the following values are saved in `localstorage`:
- `accessToken` - used for authenticated API requests
- `apiKey` - required by the Noroff API
- `userProfile` - stores the logged-in user's details (name, email, etc.)

These are cleared when the user clicks **Logout**

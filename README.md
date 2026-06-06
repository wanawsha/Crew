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

A front-end client for the [Noroff Social API v2](https://docs.noroff.dev/docs/v2/social/posts).
Built using **HTML, CSS, and Vanilla Javascript (ES6 Modules)**.

---

## Screenshots

<img width="2562" height="1592" alt="socialmediaafter" src="https://github.com/user-attachments/assets/fb055695-c799-4479-8bc6-ca04318ebaf5" />
<img width="1222" height="778" alt="Skjermbilde 2026-06-06 kl  21 05 17" src="https://github.com/user-attachments/assets/4eb8a09e-4aec-4017-afc5-fc8004da76a3" />

--- 

## Live Demo 

https://wanawsha.github.io/Crew/index.html 

---

## Repository

https://github.com/wanawsha/Crew

---

## Portfolio Improvements

For Portfolio 2, I reviewed the project and made additional improvements to prepare it for professional presentation.

### Improvements Made

* Improved the Feed page layout and visual hierarchy
* Redesigned the Profile page layout
* Improved the Create Post page styling
* Improved card layouts and spacing throughout the application
* Improved button consistency and user interface styling
* Reviewed responsiveness across different screen sizes
* Updated project documentation and README

### Related Commit

https://github.com/wanawsha/Crew/commit/f187bd0276098b043570c98bee4e989f213d3f0b

---

## API

This project uses the Noroff Social API v2:

https://docs.noroff.dev/docs/v2/social/posts

Authentication is required for:

* Creating posts
* Editing posts
* Deleting posts
* Following users
* Viewing authenticated profile data

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
- **Root /**
  - `index.html`
  - **/pages**
    - `login.html`
    - `register.html`
    - `feed.html`
    - `profile.html`
    - `post.html`
    - `create.html`
  - **/js**
    - **/api**
      - `config.js`
    - **/pages**
      - `login.js`
      - `register.js`
      - `feed.js`
      - `profile.js`
      - `post.js`
      - `create.js`
  - **/css**
    - `styles.css`
    - `feed.css`
    - `create.css`
    - `edit.css`
    - `index.css`
    - `login-register.css`
    - `post.css`
    - `profile.css`


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

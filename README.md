# Spotify API Project

🎵 A web application that integrates with the Spotify API to provide music-related features such as searching for tracks, creating playlists, and more.

---

## Features

- 🔍 **Search**: Find songs, artists, and albums using the Spotify API.
- 📄 **Track Details**: View album art, release dates, and 30-second previews.
- 🎶 **Playlists**: Create and manage custom playlists (if implemented).
- 🔐 **Authentication**: Secure login via Spotify OAuth.
- 📱 **Responsive Design**: Optimized for desktop and mobile devices.

---

## Technologies Used

| **Category**       | **Technologies**                                              |
| ------------------ | ------------------------------------------------------------- |
| **Frontend**       | HTML, CSS, JavaScript (React, Typescript)                     |
| **Backend**        | Node.js, Express                                              |
| **API**            | Spotify API for fetching playlist data and managing playlists |
| **Authentication** | Spotify OAuth for user login                                  |
| **Deployment**     | Netlify                                                       |

---

## Getting Started

### Prerequisites

1. **Spotify Developer Account**: Sign up at [Spotify for Developers](https://developer.spotify.com/).
2. **Spotify App**: Register a new app in the Spotify Developer Dashboard to get your `Client ID` and `Client Secret`.
3. **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
4. **Spotify Premium Subscription**

---

### Setup

1. **Clone the Repository**:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. **Install Dependencies**:

```bash
npm install
```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your Spotify API credentials:

```plaintext
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URI=http://localhost:3000/callback
```

4. **Run the Application**:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## How to Use

1. **Login with Spotify**:

- Click the "Login with Spotify" button to authenticate.

2. **Search for Music**:

- Use the search bar to find songs, artists, or albums.

3. **View Track Details**:

- Click on a track to see album art, release date, and a preview.

4. **Create Playlists** (if implemented):

- Save playlists to your Spotify account after logging in.

---

## Spotify API Endpoints Used

| **Endpoint**     | **Description**                        |
| ---------------- | -------------------------------------- |
| `GET /v1/search` | Search for tracks, artists, or albums. |
| `GET /v1/me`     | Get the authenticated user's profile.  |

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/YourFeatureName
```

3. Commit your changes:

```bash
git commit -m "Add YourFeatureName"
```

4. Push to the branch:

```bash
git push origin feature/YourFeatureName
```

5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Spotify for Developers](https://developer.spotify.com/) for the API.
- [Netlify](https://www.netlify.com/) for hosting.

---

## Screenshots

| **Home Page**                      | **Search Results**                        | **Track Details**                       |
| ---------------------------------- | ----------------------------------------- | --------------------------------------- |
| ![Home Page](screenshots/home.png) | ![Search Results](screenshots/search.png) | ![Track Details](screenshots/track.png) |

---

## Live Demo

🚀 Check out the live demo: [Live Demo](https://your-app-url.com)

---

import { useState } from "react";
import "./app.scss"
import { message } from "antd";
import logo from "./assets/gitfind-logo.png";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    const trimmedUsername = username.trim();

    // Empty username validation
    if (!trimmedUsername) {
      message.error("Please enter a GitHub username");
      return;
    }

    setLoading(true);
    setUser(null);
    setNotFound(false);

    try {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(
          trimmedUsername
        )}`
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 404) {
        setNotFound(true);
      } else if (response.status === 403) {
        message.error(
          "GitHub API rate limit reached. Please try again later."
        );
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      message.error("Network error. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      checkUser();
    }
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        {/* <h1 className="title">
          <span className="title-icon">⌕</span> GitFind
        </h1> */}

        <div className="brand">
          <img
            src={logo}
            alt="GitFind logo"
            className="brand-logo"
          />

          <h1 className="title">GitFind</h1>
        </div>

        <p className="subtitle">
          Find any GitHub user instantly
        </p>

        {/* Search */}
        <div className="search-box">
          <div className="input-wrapper">
            <span className="search-icon">⌕</span>

            <input
              type="text"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setNotFound(false);
              }}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoComplete="off"
            />
          </div>

          <button
            onClick={checkUser}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Checking...
              </>
            ) : (
              <>
                Check User
                <span className="button-arrow">→</span>
              </>
            )}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading">
            <span className="spinner"></span>
            <span>Searching GitHub...</span>
          </div>
        )}

        {/* User Found */}
        {user && !loading && (
          <div className="result-card">
            <img
              className="avatar"
              src={user.avatar_url}
              alt={`${user.login} avatar`}
            />

            <div className="found-badge">
              <span>✓</span> User Found
            </div>

            <h2 className="username">
              @{user.login}
            </h2>

            {user.name && (
              <p className="name">
                {user.name}
              </p>
            )}

            {user.bio && (
              <p className="bio">
                {user.bio}
              </p>
            )}

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <strong>{user.followers}</strong>
                <span>Followers</span>
              </div>

              <div className="stat">
                <strong>{user.following}</strong>
                <span>Following</span>
              </div>

              <div className="stat">
                <strong>{user.public_repos}</strong>
                <span>Repositories</span>
              </div>
            </div>

            {/* Extra Info */}
            <div className="user-details">
              {user.location && (
                <div className="detail">
                  <span className="detail-icon">📍</span>
                  <span>{user.location}</span>
                </div>
              )}

              {user.company && (
                <div className="detail">
                  <span className="detail-icon">🏢</span>
                  <span>{user.company}</span>
                </div>
              )}

              {user.blog && (
                <div className="detail">
                  <span className="detail-icon">🔗</span>
                  <a
                    href={
                      user.blog.startsWith("http")
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    {user.blog.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {/* GitHub Profile */}
            <a
              className="profile-link"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Profile
              <span>→</span>
            </a>
          </div>
        )}

        {/* User Not Found */}
        {notFound && !loading && (
          <div className="not-found">
            <div className="not-found-icon">×</div>

            <h2>User Not Found</h2>

            <p>
              No GitHub user exists with the username{" "}
              <strong>"{username.trim()}"</strong>.
            </p>

            <button
              className="try-again"
              onClick={() => {
                setUsername("");
                setNotFound(false);
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
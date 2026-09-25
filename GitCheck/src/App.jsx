import { useState } from "react";
import "./app.scss"
import { message } from "antd";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkUser = async () => {
    if (!username.trim()) return;

    if (!username) {
      message.error("Enter userNmae")
      return
    }


    setLoading(true);
    setUser(null);
    setNotFound(false);

    try {
      const response = await fetch(
        `https://api.github.com/users/${username.trim()}`
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">GitHub User Checker</h1>

        <p className="subtitle">
          Check whether a GitHub user exists
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                checkUser();
              }
            }}
          />

          <button onClick={checkUser}>
            Check User
          </button>
        </div>

        {loading && <p className="loading">Checking...</p>}

        {user && (
          <div className="result-card">
            <img
              className="avatar"
              src={user.avatar_url}
              alt={user.login}
            />

            <h2 className="found-title">✓ User Found</h2>

            <h3 className="username">@{user.login}</h3>

            {user.name && (
              <p className="name">{user.name}</p>
            )}

            {user.bio && (
              <p className="bio">{user.bio}</p>
            )}

            <a
              className="profile-link"
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View GitHub Profile →
            </a>
          </div>
        )}

        {notFound && (
          <div className="not-found">
            <h2>✕ User Not Found</h2>
            <p>
              No GitHub user exists with the username "{username}".
            </p>
          </div>
        )}
      </div>
    </div>
  );

}

export default App;

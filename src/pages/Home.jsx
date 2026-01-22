import { useState } from "react";

function Home({ onLogin }) {

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (user === "admin" && pass === "1234") {
      setError("");
      onLogin();   // control goes to App.jsx
    } else {
      setError("Invalid Username or Password");
    }
  }

  return (
    <div className="login-bg">

      <div className="login-overlay">

        {/* LOGO */}
        <img
          src="/mru-logo.png"
          alt="MRU Logo"
          className="login-logo"
        />

        {/* UNIVERSITY NAME */}
        <h1>MALLA REDDY UNIVERSITY</h1>

        {/* SUB TITLE */}
        <p className="portal-text">
          Research & Development Portal for Ph.D Scholars
        </p>

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Username"
          className="login-input"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="error-text">{error}</p>
        )}

        {/* LOGIN BUTTON */}
        <button
          className="login-btn2"
          onClick={handleLogin}
        >
          LOGIN
        </button>

      </div>
    </div>
  );
}

export default Home;

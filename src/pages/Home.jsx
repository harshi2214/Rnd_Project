import { useState } from "react";
import StudentDashboard from "./StudentDashboard";

function Home() {

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [logged, setLogged] = useState(false);

  function handleLogin() {
    if (user === "admin" && pass === "1234") {
      setLogged(true);
    } else {
      alert("Invalid login");
    }
  }

  if (logged) {
    return <StudentDashboard />;
  }

  return (
    <div className="home-container">

      <div className="home-left">
        <img src="/mru-logo.png" className="uni-logo" />
        <h2>Malla Reddy University</h2>
        <p className="tagline">
          Research & Development Portal for Ph.D Scholars
        </p>
      </div>

      <div className="home-right">
        <div className="login-card">

          <h3>Welcome</h3>

          <input
            className="input-box"
            placeholder="Username"
            onChange={(e) => setUser(e.target.value)}
          />

          <input
            className="input-box"
            type="password"
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Home;

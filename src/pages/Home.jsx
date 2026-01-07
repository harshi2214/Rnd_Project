function Home() {
  return (
    <div className="home-container">
      {/* Left Section */}
      <div className="home-left">
        <img
          src="/mru-logo.png"
          alt="Malla Reddy University Logo"
          className="uni-logo"
        />
        <h2>Malla Reddy University</h2>
        <p className="tagline">
          Research & Development Portal for Ph.D Scholars
        </p>
      </div>

      {/* Right Section */}
      <div className="home-right">
        <div className="login-card">
          <h3>Welcome</h3>

          <input
            type="text"
            placeholder="Username"
            className="input-box"
          />

          <input
            type="password"
            placeholder="Password"
            className="input-box"
          />

          <button className="login-btn">Login</button>

          <p className="forgot">Forgot Password?</p>
        </div>
      </div>
    </div>
  );
}

export default Home;

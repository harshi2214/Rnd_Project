function Header({ isLoggedIn, onLogout }) {
  return (
    <div className="header">

      <div className="header-left">
        <h3 className="header-title">
          MALLA REDDY UNIVERSITY
        </h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <p className="header-subtitle">R&D Portal</p>

        {/* LOGOUT ONLY AFTER LOGIN */}
        {isLoggedIn && (
          <button
            onClick={onLogout}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "5px 12px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        )}
      </div>

    </div>
  );
}

export default Header;

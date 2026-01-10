function Header() {
  return (
    <div style={styles.header}>
      
      <div style={styles.left}>
        <img
          src="/mru-logo.png"
          alt="MRU Logo"
          style={styles.logo}
        />
        <h3 style={styles.title}>
          MALLA REDDY UNIVERSITY
        </h3>
      </div>

      <p style={styles.portal}>
        R&D Portal
      </p>

    </div>
  );
}

const styles = {
  header: {
    background: "#0d1b2a",
    color: "white",
    padding: "10px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logo: {
    width: "30px"
  },
  title: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "1px"
  },
  portal: {
    fontSize: "14px",
    opacity: 0.8
  }
};

export default Header;

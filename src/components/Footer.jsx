function Footer() {
  return (
    <div style={styles.footer}>
      © 2026 Malla Reddy University | R&D Portal
    </div>
  );
}

const styles = {
  footer: {
    background: "#0d1b2a",
    color: "white",
    textAlign: "center",
    padding: "8px",
    fontSize: "13px",
    position: "fixed",
    bottom: 0,
    width: "100%",
    opacity: 0.9
  }
};

export default Footer;

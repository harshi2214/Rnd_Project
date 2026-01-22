import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {/* Header */}
      <Header 
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Page switch */}
      {!isLoggedIn ? (
        <Home onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <StudentDashboard />
      )}

      <Footer />
    </>
  );
}

export default App;

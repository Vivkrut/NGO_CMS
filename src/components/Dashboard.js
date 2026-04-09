import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
    } else {
      const userEmail = localStorage.getItem("email");
      setEmail(userEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

 return (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "100px"
  }}>
    <h1>Welcom to Dashboard</h1>
    <h3>Hello, {email}</h3>

    <button
      onClick={handleLogout}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "5px"
      }}
    >
      Logout
    </button>
  </div>
);
}

export default Dashboard;
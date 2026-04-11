import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function Dashboard() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.clear();
          navigate("/");
          return;
        }

        const data = await response.json();
        setMessage(data.message || "Welcome to dashboard");
        setUser(data.user || localStorage.getItem("email") || "");
        if (data.role) {
          localStorage.setItem("role", data.role);
        }
      } catch (error) {
        console.error(error);
        navigate("/");
      }
    };

    loadDashboard();
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
    <h1>Welcome to Dashboard</h1>
    {message && <p>{message}</p>}
    <h3>Hello, {user}</h3>

    {localStorage.getItem("role") === "admin" && (
      <button
        onClick={() => navigate("/admin/users")}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        Manage Users (Admin)
      </button>
    )}

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
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh || "");
        localStorage.setItem("email", data.email || email);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  background: "linear-gradient(to right, #4facfe, #00f2fe)"
}}>
      <div style={{
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        width: "300px"
      }}>

        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
  🌱 Hope Foundation
</h2>

<p style={{ textAlign: "center", fontSize: "13px", color: "gray", marginBottom: "20px" }}>
  Empowering lives through education & care
</p>
        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button
  onClick={handleLogin}
  disabled={loading}
  style={{
    width: "100%",
    padding: "10px",
    backgroundColor: loading ? "#999" : "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }}
>
  {loading ? "Logging in..." : "Login"}
</button>
      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      const normalizedEmail = email.trim().toLowerCase();
      if (!fullName.trim() || !normalizedEmail || !password) {
        setError("Full name, email, and password are required");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(normalizedEmail)) {
        setError("Enter a valid email address");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("refreshToken", data.refresh || "");
        localStorage.setItem("email", data.email || email);
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
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
        width: "320px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "5px" }}>
          Create Account
        </h2>
        <p style={{ textAlign: "center", fontSize: "13px", color: "gray", marginBottom: "20px" }}>
          Join Hope Foundation
        </p>

        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFullName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <button
          onClick={handleRegister}
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
          {loading ? "Creating..." : "Register"}
        </button>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default Register;

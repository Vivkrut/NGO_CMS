import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const normalizedEmail = email.trim().toLowerCase();
      if (!normalizedEmail) {
        setError("Email is required");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/forgot-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Unable to process request");
        return;
      }

      setMessage(data.message || "If the account exists, a reset link will be sent.");
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
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Forgot Password</h2>
        <p style={{ textAlign: "center", fontSize: "13px", color: "gray", marginBottom: "20px" }}>
          Enter your email to generate a reset link
        </p>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

        <button
          onClick={handleSubmit}
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
          {loading ? "Sending..." : "Generate Link"}
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

export default ForgotPassword;

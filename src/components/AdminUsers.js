import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/+$/, "");

function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }

    const loadUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("You do not have permission to view this page");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleRoleChange = async (userId, role) => {
    const token = localStorage.getItem("token");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/role/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to update role");
        return;
      }

      setUsers((prev) => prev.map((user) => (
        user.id === userId ? { ...user, role } : user
      )));
    } catch (err) {
      console.error(err);
      setError("Failed to update role");
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Loading users...</p>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Admin - User Roles</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px" }}>ID</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px" }}>Name</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px" }}>Email</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px" }}>Role</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{user.id}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{user.full_name}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{user.email}</td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    style={{ padding: "6px" }}
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff / Content Manager</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

export default AdminUsers;

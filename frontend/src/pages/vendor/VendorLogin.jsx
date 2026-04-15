import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/VendorLogin.css';

const VendorLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/vendors/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        navigate("/vendor/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }

    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Vendor Portal</h1>
          <p className="card-subtitle">Sign in to manage your subscriptions</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Loging..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          Don't have a vendor account?{" "}
          <span
            className="footer-link"
            onClick={() => navigate("/vendor/signup")}
          >
            Register Here
          </span>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;

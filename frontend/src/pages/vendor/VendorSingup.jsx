import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/VendorSignup.css';

const VendorSignup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.email || !form.password || !image) {
      setError("Please fill in all fields including image");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("image", image);

      const res = await fetch("http://127.0.0.1:8000/api/vendors/create", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert("Vendor account created successfully!");
        navigate("/vendor/login");
      } else {
        setError(data.message || "Registration failed. Please try again.");
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
          <h1 className="card-title">Become a Vendor</h1>
          <p className="card-subtitle">Register your milk business with us</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Vendor Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter Vendor name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Vendor Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={(e) => setImage(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register Vendor"}
          </button>
        </form>

        <p className="footer-text">
          Already registered?{" "}
          <span
            className="footer-link"
            onClick={() => navigate("/vendor/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default VendorSignup;

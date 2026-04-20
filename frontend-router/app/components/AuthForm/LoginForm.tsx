import { useState } from "react";
import { useNavigate } from "react-router";
import { showToast } from "../Toast";
import "../../styles/auth.css";

interface LoginFormProps {
    mode: "customer" | "vendor";
    onSwitchToSignup: () => void;
    onSuccess?: () => void;
}

const LoginForm = ({ mode, onSwitchToSignup, onSuccess }: LoginFormProps) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE = mode === "customer" ? "/api/customers" : "/api/vendors";
    const userType = mode === "customer" ? "Customer" : "Vendor";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            showToast.success("Login successful!");
            const dashboardRoute = mode === "customer" ? "/customers/dashboard" : "/vendors/dashboard";
            navigate(dashboardRoute);
            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-header">
                    <h1 className="auth-title">{userType} Login</h1>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="form-submit" disabled={loading}>
                        {loading ? "Loading..." : "Login"}
                    </button>

                    <p className="auth-switch-text">
                        Don't have an account?{" "}
                        <span className="auth-switch-link" onClick={onSwitchToSignup}>
                            Signup here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
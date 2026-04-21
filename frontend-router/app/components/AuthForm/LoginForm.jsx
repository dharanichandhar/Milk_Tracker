import { useNavigate } from "react-router";
import { showToast } from "../Toast";
import "../../styles/auth.css";

const LoginForm = ({ mode, onSwitchToSignup  }) => {
    const navigate = useNavigate();

    const API_BASE = mode === "customer" ? "/api/customers" : "/api/vendors";
    const userType = mode === "customer" ? "Customer" : "Vendor";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                showToast.error("Login failed");
                return;
            }

            showToast.success("Login successful!");

            const dashboardRoute = mode === "customer" ? "/customers/dashboard" : "/vendors/dashboard"; 

            navigate(dashboardRoute, { replace: true });
        } catch (err) {
            showToast.error("Something went wrong");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                <div className="auth-header">
                    <h1 className="auth-title"> {userType} Login</h1>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" 
                           className="form-input"
                           placeholder="Enter your email" 
                           required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password"
                            className="form-input"
                            placeholder="Enter your password"
                            required/>
                    </div>

                    <button type="submit" className="form-submit">
                        Login 
                    </button>

                    <p className="auth-switch-text">Don't have an account?{" "}
                        <span className="auth-switch-link" onClick={onSwitchToSignup}>Signup here</span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
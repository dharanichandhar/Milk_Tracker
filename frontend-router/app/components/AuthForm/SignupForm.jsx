import { useNavigate } from "react-router";
import { showToast } from "../Toast";
import "../../styles/auth.css";

const SignupForm = ({ mode, onSwitchToLogin }) => {
    const navigate = useNavigate();

    const API_BASE = mode === "customer" ? "/api/customers" : "/api/vendors";
    const userType = mode === "customer" ? "Customer" : "Vendor";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const image = formData.get("image");

        try {
            if (mode === "vendor" && !image.name) {
                showToast.error("Image is required for vendor signup");
                return;
            }

            let response;

            if (mode === "customer") {
                response = await fetch(`${API_BASE}/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,email,password,
                    }),
                });
            }
            else {
                const formDataToSend = new FormData();
                formDataToSend.append("name", name);
                formDataToSend.append("email", email);
                formDataToSend.append("password", password);
                formDataToSend.append("image", image);

                response = await fetch(`${API_BASE}/create`, {
                    method: "POST",
                    body: formDataToSend,
                });
            }

            const data = await response.json();

            if (!response.ok) {
                showToast.error("Signup failed");
                return;
            }
            showToast.success("Signup successful! Please login.");

            navigate(`/${mode}s/login`, { replace: true });

            onSwitchToLogin?.();

        } catch (err) {
            showToast.error("Something went wrong");
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                <div className="auth-header">
                    <h1 className="auth-title">{userType} Signup</h1>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>

                    <input type="text" name="name"
                        className="form-input"
                        placeholder="Enter your name"
                        required
                    />

                    <input type="email" name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        required
                    />

                    <input type="password" name="password"
                        className="form-input"
                        placeholder="Enter password"
                        required
                    />

                    {mode === "vendor" && (
                        <input type="file" name="image"
                            accept="image/*"
                            className="form-input"
                            required
                        />
                    )}

                    <button type="submit" className="form-submit">
                        Signup
                    </button>

                    <p className="auth-switch-text">Already have an account?{" "}
                        <span className="auth-switch-link" onClick={onSwitchToLogin}>
                            Login here
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
import { useState } from "react";
import { useNavigate } from "react-router";
import { showToast } from "../Toast";
import "../../styles/auth.css";

interface SignupFormProps {
    mode: "customer" | "vendor";
    onSwitchToLogin: () => void;
    onSuccess?: () => void;
}

const SignupForm = ({ mode, onSwitchToLogin, onSuccess }: SignupFormProps) => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_BASE = mode === "customer" ? "/api/customers" : "/api/vendors";
    const userType = mode === "customer" ? "Customer" : "Vendor";

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (mode === "vendor" && !image) {
                throw new Error("Image is required for vendor signup");
            }

            if (mode === "customer") {
                const response = await fetch(`${API_BASE}/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.detail || "Signup failed");
                }

                showToast.success("Signup successful! Please login.");
                onSwitchToLogin();
            } else {
                const formDataToSend = new FormData();
                formDataToSend.append("name", name);
                formDataToSend.append("email", email);
                formDataToSend.append("password", password);
                formDataToSend.append("image", image as File);

                const response = await fetch(`${API_BASE}/create`, {
                    method: "POST",
                    body: formDataToSend,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || data.detail || "Signup failed");
                }

                showToast.success("Signup successful! Please login.");
                onSwitchToLogin();
            }

            setName("");
            setEmail("");
            setPassword("");
            setImage(null);
            setImagePreview("");
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
                    <h1 className="auth-title">{userType} Signup</h1>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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

                    {mode === "vendor" && (
                        <div className="form-group">
                            <span className="form-file-label">Vendor Image (required)</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="form-file-input"
                                onChange={handleImageChange}
                                required
                            />
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="form-image-preview visible"
                                />
                            )}
                        </div>
                    )}

                    <button type="submit" className="form-submit" disabled={loading}>
                        {loading ? "Loading..." : "Signup"}
                    </button>

                    <p className="auth-switch-text">
                        Already have an account?{" "}
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
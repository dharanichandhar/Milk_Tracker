import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { showToast } from "../components/Toast";
import "../styles/navbar.css";

interface AuthState {
    logged_in: boolean;
    type?: "customer" | "vendor";
    name?: string;
}

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [authState, setAuthState] = useState<AuthState>({ logged_in: false });
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        setLoading(true);
        try {
            const [customerRes, vendorRes] = await Promise.all([
                fetch("/api/customers/me", { credentials: "include" }),
                fetch("/api/vendors/me", { credentials: "include" }),
            ]);

            const customer = await customerRes.json();
            const vendor = await vendorRes.json();

            if (customer.logged_in) {
                setAuthState({
                    logged_in: true,
                    type: "customer",
                    name: customer.name,
                });
            } else if (vendor.logged_in) {
                setAuthState({
                    logged_in: true,
                    type: "vendor",
                    name: vendor.name,
                });
            } else {
                setAuthState({ logged_in: false });
            }
        } catch (err) {
            setAuthState({ logged_in: false });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            if (authState.type === "customer") {
                await fetch("/api/customers/logout", {
                    method: "POST",
                    credentials: "include",
                });
            } else if (authState.type === "vendor") {
                await fetch("/api/vendors/logout", {
                    method: "POST",
                    credentials: "include",
                });
            }

            showToast.success("Logged out successfully!");
            navigate("/");
            setAuthState({ logged_in: false });
        } catch (err) {
            showToast.error("Logout failed");
        }
    };

    if (loading) {
        return (
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    Milk Tracker
                </Link>
            </nav>
        );
    }

    const isCustomerPage = location.pathname.includes("/customers");
    const isVendorPage = location.pathname.includes("/vendors");

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Milk Tracker
            </Link>

            <div className="navbar-links">
                <Link
                    to="/"
                    className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}
                >
                    Home
                </Link>

                {!authState.logged_in && (
                    <Link
                        to="/customers/login"
                        className={`navbar-link ${isCustomerPage ? "active" : ""}`}
                    >
                        Customer
                    </Link>
                )}

                {!authState.logged_in && (
                    <Link
                        to="/vendors/login"
                        className={`navbar-link ${isVendorPage ? "active" : ""}`}
                    >
                        Vendor
                    </Link>
                )}

                {authState.logged_in && authState.type === "customer" && (
                    <>
                        <Link
                            to="/customers/dashboard"
                            className={`navbar-link ${
                                location.pathname === "/customers/dashboard"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Customer
                        </Link>
                    </>
                )}

                {authState.logged_in && authState.type === "vendor" && (
                    <>
                        <Link
                            to="/vendors/dashboard"
                            className={`navbar-link ${
                                location.pathname === "/vendors/dashboard"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            Vendor
                        </Link>
                    </>
                )}

                {authState.logged_in && (
                    <div className="navbar-user">
                        <span className="navbar-username">{authState.name}</span>
                        <button className="navbar-logout" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
import { Outlet, useLoaderData, useRevalidator, Link } from "react-router";
import { useEffect } from "react";
import { ToastContainer } from "../components/Toast";
import "../styles/navbar.css";

export async function clientLoader() {
    try {
        const [customerRes, vendorRes] = await Promise.all([
            fetch("/api/customers/me", { 
                credentials: "include" 
            }),
            fetch("/api/vendors/me", { 
                credentials: "include" 
            }),
        ]);

        const customer = await customerRes.json();
        const vendor = await vendorRes.json();

        if (customer.logged_in) {
            return {
                logged_in: true,
                userType: "customer",
                name: customer.name,
            };
        } else if (vendor.logged_in) {
            return {
                logged_in: true,
                userType: "vendor",
                name: vendor.name,
            };
        }
    } catch (err) {
        console.error("Auth check failed", err);
    }

    return {
        logged_in: false,
        userType: null,
        name: null,
    };
}

clientLoader.hydrate = true;

export default function NavbarLayout() {
    const loaderData = useLoaderData();
    const revalidator = useRevalidator();

    useEffect(() => {
        const handleFocus = () => {
            revalidator.revalidate();
        };
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, [revalidator]);

    const handleLogout = async () => {
        try {
            if (loaderData.userType === "customer") {
                await fetch("/api/customers/logout", {
                    method: "POST",
                    credentials: "include",
                });
            } else if (loaderData.userType === "vendor") {
                await fetch("/api/vendors/logout", {
                    method: "POST",
                    credentials: "include",
                });
            }
            revalidator.revalidate();
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    const pathname = window.location.pathname;
    const isHome = pathname === "/";
    const isCustomerPage = pathname.includes("/customers");
    const isVendorPage = pathname.includes("/vendors");
    const isCustomerDashboard = pathname === "/customers/dashboard";
    const isVendorDashboard = pathname === "/vendors/dashboard";

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-brand">
                    Milk Tracker
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${isHome ? "active" : ""}`}
                    >
                        Home
                    </Link>

                    {!loaderData.logged_in && (
                        <Link
                            to="/customers/login"
                            className={`navbar-link ${isCustomerPage ? "active" : ""}`}
                        >
                            Customer
                        </Link>
                    )}

                    {!loaderData.logged_in && (
                        <Link
                            to="/vendors/login"
                            className={`navbar-link ${isVendorPage ? "active" : ""}`}
                        >
                            Vendor
                        </Link>
                    )}

                    {loaderData.logged_in && loaderData.userType === "customer" && (
                        <Link
                            to="/customers/dashboard"
                            className={`navbar-link ${isCustomerDashboard ? "active" : ""}`}
                        >
                            Customer Dashboard
                        </Link>
                    )}

                    {loaderData.logged_in && loaderData.userType === "vendor" && (
                        <Link
                            to="/vendors/dashboard"
                            className={`navbar-link ${isVendorDashboard ? "active" : ""}`}
                        >
                            Vendor Dashboard
                        </Link>
                    )}

                    {loaderData.logged_in && (
                        <div className="navbar-user">
                            <span className="navbar-username">{loaderData.name}</span>
                            <button className="navbar-logout" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
            <ToastContainer />
            <Outlet />
        </>
    );
}

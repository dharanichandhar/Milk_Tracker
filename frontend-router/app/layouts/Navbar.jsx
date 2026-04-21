import { Outlet, useLoaderData, useRevalidator, Link, NavLink, } from "react-router";
import { ToastContainer } from "../components/Toast";
import "../styles/navbar.css";

export async function clientLoader() {
    try {
        const [customerRes, vendorRes] = await Promise.all([
            fetch("/api/customers/me", { credentials: "include" }),
            fetch("/api/vendors/me", { credentials: "include" }),
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

export function shouldRevalidate() {
    return true;
}

export default function NavbarLayout() {
    const loaderData = useLoaderData();
    const revalidator = useRevalidator();

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

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbar-brand"> Milk Tracker   </Link>

                <div className="navbar-links">

            
                    <NavLink  to="/" className={({ isActive }) =>
                            `navbar-link ${isActive ? "active" : ""}` } >
                        Home
                    </NavLink>

                   
                    {!loaderData.logged_in && (
                        <>
                            <NavLink to="/customers/login" className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`}>
                                Customer
                            </NavLink>

                            <NavLink to="/vendors/login" className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`}>
                                Vendor
                            </NavLink>
                        </>
                    )}


                    {loaderData.logged_in &&
                        loaderData.userType === "customer" && (
                            <NavLink to="/customers/dashboard" className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`}>
                                Customer Dashboard
                            </NavLink>
                        )}

                    
                    {loaderData.logged_in &&
                        loaderData.userType === "vendor" && (
                            <NavLink to="/vendors/dashboard" className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`}>
                                Vendor Dashboard
                            </NavLink>
                        )}

                    {loaderData.logged_in && (
                        <div className="navbar-user">
                            <span className="navbar-username">
                                {loaderData.name}
                            </span>
                            <button className="navbar-logout"  onClick={handleLogout}>
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
import { useLoaderData, Navigate } from "react-router";
import CustomerCard from "../../components/CustomerCard";
import "../../styles/dashboard.css";

export async function clientLoader() {
    const vendorRes = await fetch("/api/vendors/me", {
        credentials: "include",
    });
    const vendorData = await vendorRes.json();

    if (!vendorData.logged_in) {
        return { shouldRedirect: true, redirectTo: "/vendors/login" };
    }

    const particularRes = await fetch(`/api/vendors/particular/${vendorData.vendor_id}`, {
        credentials: "include",
    });
    const particularData = await particularRes.json();

    if (!particularData.success) {
        return { shouldRedirect: true, redirectTo: "/vendors/login" };
    }

    return {
        shouldRedirect: false,
        logged_in: true,
        vendor_id: vendorData.vendor_id,
        vendor_name: particularData.vendor.name,
        image_url: particularData.vendor.image_url,
        customers: particularData.vendor.customers || [],
        customerCount: particularData.vendor.customers?.length || 0,
    };
}

clientLoader.hydrate = true;

export function meta() {
    return [
        { title: "Vendor Dashboard - TinyMagiq" },
    ];
}

export default function VendorDashboard() {
    const loaderData = useLoaderData();

    if (loaderData.shouldRedirect) {
        return <Navigate to={loaderData.redirectTo} replace />;
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-welcome">
                        Welcome, <span>{loaderData.vendor_name}</span>!
                    </h1>
                    <p className="dashboard-subtitle">Your vendor dashboard</p>
                </div>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <p className="stat-label">Total Subscribed Customers</p>
                        <p className="stat-value">{loaderData.customerCount}</p>
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            My Subscribed Customers ({loaderData.customerCount})
                        </h2>
                    </div>

                    {loaderData.customers.length === 0 ? (
                        <div className="empty-state">
                            <p>No customers have subscribed to you yet.</p>
                        </div>
                    ) : (
                        <div className="customer-grid">
                            {loaderData.customers.map((customer) => (
                                <CustomerCard key={customer.id} customer={customer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
import { useLoaderData, useNavigation, Navigate } from "react-router";
import { useState } from "react";
import VendorCard from "../../components/VendorCard";
import SubscribeDropdown from "../../components/SubscribeDropdown";
import "../../styles/dashboard.css";

export async function clientLoader() {
    const customerRes = await fetch("/api/customers/me", {
        credentials: "include",
    });
    const customerData = await customerRes.json();

    if (!customerData.logged_in) {
        return { shouldRedirect: true, redirectTo: "/customers/login" };
    }

    const subsRes = await fetch("/api/subscriptions/subscription-data", {
        credentials: "include",
    });
    const subsData = await subsRes.json();

    return {
        shouldRedirect: false,
        logged_in: true,
        customer_id: customerData.customer_id,
        customer_name: customerData.name,
        subscribed_vendors: subsData.subscribed_vendors || [],
        available_vendors: subsData.available_vendors || [],
    };
}

clientLoader.hydrate = true;

export function meta() {
    return [
        { title: "Customer Dashboard - TinyMagiq" },
    ];
}

export default function CustomerDashboard() {
    const loaderData = useLoaderData();
    const navigation = useNavigation();
    const [actionLoading, setActionLoading] = useState(false);

    if (loaderData.shouldRedirect) {
        return <Navigate to={loaderData.redirectTo} replace />;
    }

    const isSubmitting = navigation.state === "submitting" || actionLoading;

    const handleUnsubscribe = async (vendorId) => {
        if (!confirm(`Are you sure you want to unsubscribe from this vendor?`)) {
            return;
        }

        setActionLoading(true);
        try {
            const res = await fetch(`/api/subscriptions/unsubscribe/${vendorId}`, {
                method: "POST",
                credentials: "include",
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const error = await res.json();
                alert(error.detail || "Failed to unsubscribe");
            }
        } catch (err) {
            alert("Failed to unsubscribe");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSubscribe = async (vendorId) => {
        setActionLoading(true);
        try {
            const res = await fetch("/api/subscriptions/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ vendor_id: vendorId }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const error = await res.json();
                alert(error.detail || "Failed to subscribe");
            }
        } catch (err) {
            alert("Failed to subscribe");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-welcome">
                        Welcome, <span>{loaderData.customer_name}</span>!
                    </h1>
                    <p className="dashboard-subtitle">Your customer dashboard</p>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            My Subscribed Vendors ({loaderData.subscribed_vendors.length})
                        </h2>
                    </div>

                    {loaderData.subscribed_vendors.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't subscribed to any vendors yet.</p>
                        </div>
                    ) : (
                        <div className="vendor-grid">
                            {loaderData.subscribed_vendors.map((vendor) => (
                                <VendorCard
                                    key={vendor.id}
                                    vendor={vendor}
                                    onUnsubscribe={() => handleUnsubscribe(vendor.id)}
                                    loading={isSubmitting}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Subscribe to New Vendors</h2>
                    </div>

                    {loaderData.available_vendors.length > 0 ? (
                        <SubscribeDropdown
                            vendors={loaderData.available_vendors}
                            onSubscribe={handleSubscribe}
                            loading={isSubmitting}
                        />
                    ) : (
                        <div className="empty-state">
                            <p>No more vendors available to subscribe</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
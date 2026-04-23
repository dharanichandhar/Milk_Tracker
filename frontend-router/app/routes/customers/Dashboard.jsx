import {useLoaderData, useNavigation, Navigate, useFetcher} from "react-router";
import { useState } from "react";
import VendorCard from "../../components/VendorCard";
import "../../styles/dashboard.css";


export async function clientLoader() {
    const customerRes = await fetch("/api/customers/me", { credentials: "include",});
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
        customer_name: customerData.name,
        subscribed_vendors: subsData.subscribed_vendors || [],
        available_vendors: subsData.available_vendors
            ? [...subsData.available_vendors].sort((a, b) =>a.name.localeCompare(b.name)): [],
        };
}

clientLoader.hydrate = true;

export async function clientAction({ request }) {
    const formData = await request.formData();

    const type = formData.get("type");
    const vendorId = formData.get("vendorId");

    try {
        if (type === "unsubscribe") {
            await fetch(`/api/subscriptions/unsubscribe/${vendorId}`, {
                method: "POST",
                credentials: "include",
            });
        }

        if (type === "subscribe") {
            await fetch("/api/subscriptions/create", {
                method: "POST",
                headers: {"Content-Type": "application/json",},
                credentials: "include",
                body: JSON.stringify({vendor_id: Number(vendorId),}),
            });
        }
        return { success: true };
    } catch (err) {
        return { success: false };
    }
}

export default function CustomerDashboard() {
    const loaderData = useLoaderData();
    const navigation = useNavigation();
    const fetcher = useFetcher();

    const [selectedVendor, setSelectedVendor] = useState("");

    if (loaderData.shouldRedirect) {
        return <Navigate to={loaderData.redirectTo} replace />;
    }

    const isSubmitting =
        navigation.state === "submitting" ||
        fetcher.state === "submitting";

    const handleUnsubscribe = (vendorId) => {
        fetcher.submit(
            { type: "unsubscribe", vendorId },
            { method: "post" }
        );
    };


    const handleSubscribe = () => {
        if (!selectedVendor) {
            alert("Please select a vendor");
            return;
        }
        fetcher.submit(
            { type: "subscribe", vendorId: selectedVendor },
            { method: "post" }
        );
    };


    return (
        <div className="dashboard-page">
            <div className="dashboard-container">

                <div className="dashboard-header">
                    <h1 className="dashboard-welcome">
                        Welcome, <span>{loaderData.customer_name}</span>!
                    </h1>
                    <p className="dashboard-subtitle">
                        Your customer dashboard
                    </p>
                </div>

                {/* SUBSCRIBED */}
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
                                    onUnsubscribe={() =>
                                        handleUnsubscribe(vendor.id)
                                    }
                                    loading={isSubmitting}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            Subscribe to New Vendors
                        </h2>
                    </div>

                    {loaderData.available_vendors.length > 0 ? (
                        <div className="section-actions">
                            <select
                                className="subscribe-dropdown"
                                value={selectedVendor}
                                onChange={(e) =>
                                    setSelectedVendor(e.target.value)
                                }
                            >
                                <option value="">Select a vendor</option>
                                {loaderData.available_vendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="subscribe-btn"
                                onClick={handleSubscribe}
                                disabled={isSubmitting || !selectedVendor}
                            >
                                {isSubmitting ? "Subscribing..." : "Subscribe"}
                            </button>
                        </div>
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
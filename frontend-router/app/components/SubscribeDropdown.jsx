import { useState } from "react";
import { showToast } from "./Toast";

const SubscribeDropdown = ({ vendors, onSubscribe, loading }) => {
    const [selectedVendorId, setSelectedVendorId] = useState("");

    const handleSubscribe = async () => {
        if (!selectedVendorId) {
            showToast.error("Please select a vendor");
            return;
        }

        try {
            await onSubscribe(Number(selectedVendorId));
            setSelectedVendorId("");
        } catch (err) {
            showToast.error(err instanceof Error ? err.message : "Failed to subscribe");
        }
    };

    if (vendors.length === 0) {
        return (
            <div className="empty-state">
                <p>No vendors available to subscribe</p>
            </div>
        );
    }

    return (
        <div className="section-actions">
            <select
                className="subscribe-dropdown"
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
            >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                    </option>
                ))}
            </select>
            <button
                className="subscribe-btn"
                onClick={handleSubscribe}
                disabled={loading || !selectedVendorId}
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
        </div>
    );
};

export default SubscribeDropdown;

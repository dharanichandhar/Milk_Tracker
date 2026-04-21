import { showToast } from "./Toast";

const SubscribeDropdown = ({ vendors, onSubscribe, loading, value, onChange }) => {
    const handleSubscribe = async () => {
        if (!value) {
            showToast.error("Please select a vendor");
            return;
        }

        try {
            await onSubscribe(Number(value));
            onChange("");
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
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
                disabled={loading || !value}
            >
                {loading ? "Subscribing..." : "Subscribe"}
            </button>
        </div>
    );
};

export default SubscribeDropdown;
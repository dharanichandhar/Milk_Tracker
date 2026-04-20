import { showToast } from "./Toast";

interface VendorCardProps {
    vendor: {
        id: number;
        name: string;
        image_url?: string;
    };
    onUnsubscribe: (vendorId: number) => Promise<void>;
    loading?: boolean;
}

const VendorCard = ({ vendor, onUnsubscribe, loading }: VendorCardProps) => {
    const handleUnsubscribe = async () => {
        if (window.confirm(`Are you sure you want to unsubscribe from ${vendor.name}?`)) {
            try {
                await onUnsubscribe(vendor.id);
            } catch (err) {
                showToast.error(err instanceof Error ? err.message : "Failed to unsubscribe");
            }
        }
    };

    return (
        <div className="vendor-card">
            <div className="vendor-card-header">
                {vendor.image_url ? (
                    <img src={vendor.image_url} alt={vendor.name} className="vendor-card-image"/>
                ) : (
                    <div
                        className="vendor-card-image"
                        style={{
                            background: "#00d9ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#1a1a2e",
                        }}
                    >
                        {vendor.name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="vendor-card-info">
                    <h3>{vendor.name}</h3>
                </div>
            </div>
            <button
                className="vendor-card-unsubscribe"
                onClick={handleUnsubscribe}
                disabled={loading}
            >
                {loading ? "Unsubscribing..." : "Unsubscribe"}
            </button>
        </div>
    );
};

export default VendorCard;
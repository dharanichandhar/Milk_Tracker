import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import VendorCard from "../../components/VendorCard";
import SubscribeDropdown from "../../components/SubscribeDropdown";
import { useAuth } from "../../components/hooks/useAuth";
import { useSubscription } from "../../components/hooks/useSubscription";
import "../../styles/dashboard.css";

interface Vendor {
    id: number;
    name: string;
    image_url?: string;
}

const CustomerDashboard = () => {
    const navigate = useNavigate();
    const { checkCustomerAuth } = useAuth();
    const { fetchMyVendors, fetchAvailableVendors, subscribe, unsubscribe} = useSubscription();

    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState("");
    const [customerId, setCustomerId] = useState(0);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);

    const fetchData = async () => {
        const customer = await checkCustomerAuth();
        if (!customer) {
            navigate("/customers/login");
            return;
        }

        setCustomerName(customer.name || "");
        setCustomerId(customer.customer_id || 0);

        const [myVendors, available] = await Promise.all([
            fetchMyVendors(),
            fetchAvailableVendors(),
        ]);

        setVendors(myVendors);
        setAvailableVendors(available);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleUnsubscribe = async (vendorId: number) => {
        const success = await unsubscribe(vendorId);
        if (success) {
            fetchData();
        }
    };

    const handleSubscribe = async (vendorId: number) => {
        const success = await subscribe(vendorId);
        if (success) {
            fetchData();
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="dashboard-container">
                    <div className="empty-state">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-welcome">
                        Welcome, <span>{customerName}</span>!
                    </h1>
                    <p className="dashboard-subtitle">Your customer dashboard</p>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            My Subscribed Vendors ({vendors.length})
                        </h2>
                    </div>

                    {vendors.length === 0 ? (
                        <div className="empty-state">
                            <p>You haven't subscribed to any vendors yet.</p>
                        </div>
                    ) : (
                        <div className="vendor-grid">
                            {vendors.map((vendor) => (
                                <VendorCard
                                    key={vendor.id}
                                    vendor={vendor}
                                    onUnsubscribe={handleUnsubscribe}
                                    // loading={actionLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">Subscribe to New Vendors</h2>
                    </div>

                    {availableVendors.length > 0 ? (
                        <SubscribeDropdown
                            vendors={availableVendors}
                            onSubscribe={handleSubscribe}
                            // loading={actionLoading}
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
};

export default CustomerDashboard;
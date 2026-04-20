import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CustomerCard from "../../components/CustomerCard";
import { useAuth } from "../../components/hooks/useAuth";
import "../../styles/dashboard.css";

interface Customer {
    id: number;
    name: string;
}

interface VendorData {
    vendor_name: string;
    image_url?: string;
    customers: Customer[];
}

const VendorDashboard = () => {
    const navigate = useNavigate();
    const { checkVendorAuth } = useAuth();

    const [loading, setLoading] = useState(true);
    const [vendorName, setVendorName] = useState("");
    const [vendorImage, setVendorImage] = useState("");
    const [customerCount, setCustomerCount] = useState(0);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const fetchData = async () => {
        const vendor = await checkVendorAuth();
        if (!vendor) {
            navigate("/vendors/login");
            return;
        }

        try {
            const response = await fetch(`/api/vendors/particular/${vendor.vendor_id}`, {
                credentials: "include",
            });
            const data = await response.json();

            if (data.success) {
                setVendorName(data.vendor.name);
                setVendorImage(data.vendor.image_url || "");
                setCustomers(data.vendor.customers || []);
                setCustomerCount(data.vendor.customers?.length || 0);
            }
        } catch (err) {
            console.error("Failed to load vendor data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

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
                        Welcome, <span>{vendorName}</span>!
                    </h1>
                    <p className="dashboard-subtitle">Your vendor dashboard</p>
                </div>

                <div className="dashboard-stats">
                    <div className="dashboard-stat-card">
                        <p className="stat-label">Total Subscribed Customers</p>
                        <p className="stat-value">{customerCount}</p>
                    </div>
                </div>

                <div className="dashboard-section">
                    <div className="section-header">
                        <h2 className="section-title">
                            My Subscribed Customers ({customerCount})
                        </h2>
                    </div>

                    {customers.length === 0 ? (
                        <div className="empty-state">
                            <p>No customers have subscribed to you yet.</p>
                        </div>
                    ) : (
                        <div className="customer-grid">
                            {customers.map((customer) => (
                                <CustomerCard key={customer.id} customer={customer} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
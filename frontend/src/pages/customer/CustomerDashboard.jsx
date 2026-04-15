import { useEffect, useState } from "react";
import SubscribedVendors from "../../components/SubscribedVendors";
import SubscribeSection from "../../components/SubscribeSection";
import { useAuth } from "../../hooks/useAuth";
import '../../styles/CustomerDashboard.css';

const CustomerDashboard = () => {
  const { customer } = useAuth();
  const [subscribed, setSubscribed] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("/api/subscriptions/subscription-data", {
      credentials: "include",
    });

    const data = await res.json();

    setSubscribed(data.subscribed_vendors || []);
    setAvailable(data.available_vendors || []);
    setLoading(false);
  };

  const handleSubscribe = async (vendorId) => {
    if (!vendorId) return alert("Select vendor");

    setSubLoading(true);

    await fetch("http://127.0.0.1:8000/api/subscriptions/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        vendor_id: Number(vendorId),
      }),
    });

    setSelectedVendor("");
    setSubLoading(false);
    loadData();
  };

  const handleUnsubscribe = async (vendorId) => {
    await fetch(`/api/subscriptions/unsubscribe/${vendorId}`, {
      method: "POST",
      credentials: "include",
    });

    loadData();
  };

  if (loading) return <h3 className="loading-state">Loading...</h3>;

  return (
    <div className="page-container">
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome {customer?.name || "Customer"}</h2>
        <p className="welcome-subtitle">Manage your milk subscriptions</p>
      </div>

      <SubscribeSection
        available={available}
        selectedVendor={selectedVendor}
        setSelectedVendor={setSelectedVendor}
        onSubscribe={handleSubscribe}
        loading={subLoading}
      />

      <SubscribedVendors
        vendors={subscribed}
        onUnsubscribe={handleUnsubscribe}
      />
    </div>
  );
};

export default CustomerDashboard;

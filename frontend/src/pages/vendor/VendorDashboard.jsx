import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import VendorInfo from "../../components/VendorInfo";
import CustomerList from "../../components/CustomerList";
import { useAuth } from "../../hooks/useAuth";
import '../../styles/VendorDashboard.css';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { vendor } = useAuth();

  const [vendorId, setVendorId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/vendors/dashboard",
        {
          method: "GET",
          credentials: "include"
        }
      );

      if (!res.ok) {
        navigate("/vendor/login");
        return;
      }

      const data = await res.json();
      setVendorId(data.vendor_id);

      const vendorRes = await fetch(
        `http://127.0.0.1:8000/api/vendors/particular/${data.vendor_id}`
      );

      const vendorData = await vendorRes.json();

      if (vendorData.success) {
        setCustomers(vendorData.vendor.customers);
      }

    } catch (err) {
      console.log("Dashboard error:", err);
      navigate("/vendor/login");
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/vendors/logout", {
        method: "POST",
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        navigate("/vendor/login");
      } else {
        console.log(data.message);
      }

    } catch (err) {
      console.log("Logout failed:", err);
    }
  };

  if (loading) return <h3 className="loading-state">Loading...</h3>;

  return (
    <div className="page-container">
      <div className="header">
        <div className="header-left">
          <h2 className="welcome-title">Welcome {vendor?.name || "Vendor"}</h2>
          <p className="welcome-subtitle">
            <span className="vendor-badge">Vendor Dashboard</span>
          </p>
        </div>
      </div>

      <VendorInfo vendorId={vendorId} />

      <CustomerList customers={customers} />
    </div>
  );
};

export default VendorDashboard;

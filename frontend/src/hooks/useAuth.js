import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAuth = () => {
  const [customer, setCustomer] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [location]); 

  const checkAuth = async () => {
    try {
      const customerRes = await fetch("http://127.0.0.1:8000/api/customers/me", {
        credentials: "include"
      });
      const customerData = await customerRes.json();
      
      if (customerData.logged_in) {
        setCustomer({ 
          id: customerData.customer_id, 
          name: customerData.name 
        });
      } else {
        setCustomer(null);
      }

      const vendorRes = await fetch("http://127.0.0.1:8000/api/vendors/me", {
        credentials: "include"
      });
      const vendorData = await vendorRes.json();
      
      if (vendorData.logged_in) {
        setVendor({ 
          id: vendorData.vendor_id, 
          name: vendorData.name 
        });
      } else {
        setVendor(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
    setLoading(false);
  };

  const logoutCustomer = async () => {
    await fetch("http://127.0.0.1:8000/api/customers/logout", {
      method: "POST",
      credentials: "include"
    });
    setCustomer(null);
  };

  const logoutVendor = async () => {
    await fetch("http://127.0.0.1:8000/api/vendors/logout", {
      method: "POST",
      credentials: "include"
    });
    setVendor(null);
  };

  return {
    customer,
    vendor,
    loading,
    logoutCustomer,
    logoutVendor,
    checkAuth
  };
};

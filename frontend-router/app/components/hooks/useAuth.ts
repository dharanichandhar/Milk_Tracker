import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { showToast } from "../Toast";

interface UserData {
    logged_in: boolean;
    customer_id?: number;
    vendor_id?: number;
    name?: string;
}

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const checkCustomerAuth = useCallback(async (): Promise<UserData | false> => {
        try {
            const response = await fetch("/api/customers/me", {
                credentials: "include",
            });
            const result = await response.json();

            if (!response.ok || !result.logged_in) {
                return false;
            }

            return {
                logged_in: true,
                customer_id: result.customer_id,
                name: result.name,
            };
        } catch {
            return false;
        }
    }, []);

    const checkVendorAuth = useCallback(async (): Promise<UserData | false> => {
        try {
            const response = await fetch("/api/vendors/me", {
                credentials: "include",
            });
            const result = await response.json();

            if (!response.ok || !result.logged_in) {
                return false;
            }

            return {
                logged_in: true,
                vendor_id: result.vendor_id,
                name: result.name,
            };
        } catch {
            return false;
        }
    }, []);

    const customerLogout = useCallback(async () => {
        setLoading(true);
        try {
            await fetch("/api/customers/logout", {
                method: "POST",
                credentials: "include",
            });
            showToast.success("Logged out successfully!");
            navigate("/");
        } catch {
            showToast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const vendorLogout = useCallback(async () => {
        setLoading(true);
        try {
            await fetch("/api/vendors/logout", {
                method: "POST",
                credentials: "include",
            });
            showToast.success("Logged out successfully!");
            navigate("/");
        } catch {
            showToast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    return {
        loading,
        checkCustomerAuth,
        checkVendorAuth,
        customerLogout,
        vendorLogout,
    };
};
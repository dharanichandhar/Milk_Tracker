import { useState, useCallback } from "react";
import { showToast } from "../Toast";

interface Vendor {
    id: number;
    name: string;
    image_url?: string;
}

interface SubscriptionData {
    subscribed_vendors: Vendor[];
    available_vendors: Vendor[];
}

export const useSubscription = () => {
    const [loading, setLoading] = useState(false);

    const fetchMyVendors = useCallback(async (): Promise<Vendor[]> => {
        try {
            const response = await fetch("/api/subscriptions/my-vendors", {
                credentials: "include",
            });
            const data = await response.json();
            return data.vendors || [];
        } catch {
            return [];
        }
    }, []);

    const fetchAvailableVendors = useCallback(async (): Promise<Vendor[]> => {
        try {
            const response = await fetch("/api/subscriptions/subscription-data", {
                credentials: "include",
            });
            const data: SubscriptionData = await response.json();
            return data.available_vendors || [];
        } catch {
            return [];
        }
    }, []);

    const subscribe = useCallback(async (vendorId: number): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await fetch("/api/subscriptions/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ vendor_id: vendorId }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Failed to subscribe");
            }

            showToast.success("Subscribed successfully!");
            return true;
        } catch (err) {
            showToast.error(err instanceof Error ? err.message : "Failed to subscribe");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async (vendorId: number): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await fetch(`/api/subscriptions/unsubscribe/${vendorId}`, {
                method: "POST",
                credentials: "include",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || "Failed to unsubscribe");
            }

            showToast.success("Unsubscribed successfully!");
            return true;
        } catch (err) {
            showToast.error(err instanceof Error ? err.message : "Failed to unsubscribe");
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        fetchMyVendors,
        fetchAvailableVendors,
        subscribe,
        unsubscribe,
    };
};
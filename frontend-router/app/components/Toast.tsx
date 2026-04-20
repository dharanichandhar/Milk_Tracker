import { useEffect, useState } from "react";
import "./Toast.css";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number;
    onClose?: () => void;
}

const Toast = ({ message, type = "success", duration = 3000, onClose }: ToastProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-message">{message}</span>
            <button className="toast-close" onClick={() => {
                setVisible(false);
                onClose?.();
            }}>
                ×
            </button>
        </div>
    );
};

export const showToast = {
    success: (message: string) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "success" } }));
    },
    error: (message: string) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "error" } }));
    },
    info: (message: string) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "info" } }));
    },
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);

    useEffect(() => {
        const handleToast = (e: CustomEvent) => {
            const { message, type } = e.detail;
            const id = Date.now();
            setToasts((prev) => [...prev, { id, message, type }]);
        };

        window.addEventListener("toast", handleToast as EventListener);
        return () => window.removeEventListener("toast", handleToast as EventListener);
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type as "success" | "error" | "info"}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;
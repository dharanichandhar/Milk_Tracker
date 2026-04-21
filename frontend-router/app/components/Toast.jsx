import { useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({ message, type = "success", duration = 2000, onClose }) => {
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
    success: (message) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "success" } }));
    },
    error: (message) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "error" } }));
    },
    info: (message) => {
        window.dispatchEvent(new CustomEvent("toast", { detail: { message, type: "info" } }));
    },
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const handleToast = (e) => {
            const { message, type } = e.detail;
            const id = Date.now();
            setToasts((prev) => [...prev, { id, message, type }]);
        };

        window.addEventListener("toast", handleToast);
        return () => window.removeEventListener("toast", handleToast);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default Toast;

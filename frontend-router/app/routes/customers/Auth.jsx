import { useLoaderData, Navigate } from "react-router";
import AuthForm from "../../components/AuthForm/AuthForm";

export async function clientLoader() {
    const res = await fetch("/api/customers/me", {
        credentials: "include",
    });
    const data_response = await res.json();

    if (data_response.logged_in) {
        return { shouldRedirect: true, redirectTo: "/customers/dashboard" };
    }

    return { shouldRedirect: false, alreadyLoggedIn: false };
}

clientLoader.hydrate = true;

export default function CustomerAuth() {
    const loaderData = useLoaderData();

    if (loaderData.shouldRedirect) {
        return <Navigate to={loaderData.redirectTo} replace />;
    }

    return <AuthForm mode="customer" />;
}

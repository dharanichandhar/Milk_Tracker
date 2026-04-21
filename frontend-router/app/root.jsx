import { isRouteErrorResponse, Links, Meta, Outlet, Scripts } from "react-router";
import "./app.css";


export function Layout({ children }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <Scripts />
            </body>
        </html>
    );
}

export default function Root() {
    return <Outlet />;
}




export function ErrorBoundary({ error }) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";


    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =error.status === 404 ? "The requested page could not be found." : error.statusText || details;

    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
    }

    return (
        <main className="error-container">
            <h1>{message}</h1>
            <p>{details}</p>
        </main>
    );
}

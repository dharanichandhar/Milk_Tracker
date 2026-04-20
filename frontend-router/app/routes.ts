import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/navbar.tsx", [
        index("routes/home.tsx"),
        route("customers/login", "routes/customers/auth.tsx"),
        route("customers/dashboard", "routes/customers/dashboard.tsx"),
        route("vendors/login", "routes/vendors/auth.tsx"),
        route("vendors/dashboard", "routes/vendors/dashboard.tsx"),
    ]),
] satisfies RouteConfig;
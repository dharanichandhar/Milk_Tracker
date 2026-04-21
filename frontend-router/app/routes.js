import { index, layout, route } from "@react-router/dev/routes";

export default [
    layout("layouts/Navbar.jsx", [
        index("routes/Home.jsx"),
        route("customers/login", "routes/customers/Auth.jsx"),
        route("customers/dashboard", "routes/customers/Dashboard.jsx"),
        route("vendors/login", "routes/vendors/Auth.jsx"),
        route("vendors/dashboard", "routes/vendors/Dashboard.jsx"),
    ]),
];
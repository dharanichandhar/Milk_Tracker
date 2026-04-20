import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { ToastContainer } from "../components/Toast";

const NavbarLayout = () => {
    return (
        <>
            <Navbar />
            <ToastContainer />
            <Outlet />
        </>
    );
};

export default NavbarLayout;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { customer, vendor, logoutCustomer, logoutVendor } = useAuth();

  const handleLogoutCustomer = async () => {
    await logoutCustomer();
    navigate('/');
  };

  const handleLogoutVendor = async () => {
    await logoutVendor();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">
        <span className="logo-icon"></span>
        Milk Tracker
      </h2>

      <div className="nav-links">
        <Link className="nav-link" to="/">Home</Link>

        <div className="auth-section">
          {customer ? (
            <>
              <Link className="nav-link" to="/customer/dashboard">Customer Dashboard</Link>
              <button className="logout-btn" onClick={handleLogoutCustomer}>Logout</button>
            </>
          ) : vendor ? (
            <>
              <Link className="nav-link" to="/vendor/dashboard">Vendor Dashboard</Link>
              <button className="logout-btn" onClick={handleLogoutVendor}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/customer/login">Customer Login</Link>
              <Link className="nav-link" to="/vendor/login">Vendor Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

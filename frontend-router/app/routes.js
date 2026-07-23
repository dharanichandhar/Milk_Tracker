import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('layouts/Navbar.jsx', [
    index('routes/Home.jsx'),
    route('customers/login', 'routes/customers/Auth.jsx'),
    route('vendors/login', 'routes/vendors/Auth.jsx'),
  ]),

  layout('layouts/CustomerSidebar.jsx', [
    route('customers/dashboard', 'routes/customers/Dashboard.jsx'),
    route('customers/vendors', 'routes/customers/Vendors.jsx'),
    route('customers/subscriptions', 'routes/customers/Subscriptions.jsx'),
    route('customers/calendar', 'routes/customers/Calendar.jsx'),
    route('customers/payments', 'routes/customers/Payments.jsx'),
    route('customers/profile', 'routes/customers/Profile.jsx'),
  ]),

  layout('layouts/VendorSidebar.jsx', [
    route('vendors/dashboard', 'routes/vendors/Dashboard.jsx'),
    route('vendors/customers', 'routes/vendors/Customers.jsx'),
    route('vendors/customers/:id', 'routes/vendors/CustomerDetail.jsx'),
    route('vendors/pricing', 'routes/vendors/Pricing.jsx'),
    route('vendors/payment-history', 'routes/vendors/PaymentHistory.jsx'),
    route('vendors/profile', 'routes/vendors/Profile.jsx'),
  ]),
];

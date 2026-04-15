import React from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import VendorLogin from './pages/vendor/VendorLogin';
import VendorSingup from './pages/vendor/VendorSingup';
import VendorDashboard from './pages/vendor/VendorDashboard';
import CustomerSignup from './pages/customer/CustomerSingup';
import CustomerLogin from './pages/customer/CustomerLogin';
import CustomerDashboard from './pages/customer/CustomerDashboard';


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout/>}>
      <Route path= "/" element={<Home/>}></Route>
      
      <Route path="/vendor/signup" element={<VendorSingup/>} />
      <Route path="/vendor/login" element={<VendorLogin/>} />
      <Route path= "/vendor/dashboard" element={<VendorDashboard/>}/>

      <Route path= "/customer/signup" element={<CustomerSignup/>}/>
      <Route path="/customer/login" element={<CustomerLogin/>}/>
      <Route path="/customer/dashboard" element={<CustomerDashboard/>} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App

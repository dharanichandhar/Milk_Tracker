import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import '../styles/MainLayout.css'

const MainLayout = () => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout

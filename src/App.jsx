import React from 'react'

import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import ProfilePage from './pages/ProfilePage'
import OpportunitiesPage from './pages/OpportunitiesPage'
import OrdersPage from './pages/OrdersPage'
import EarningsPage from './pages/EarningsPage'
import SalahPage from './pages/SalahPage'
import OrderDetailsPage from "./pages/OrderDetails";

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#FAF7F2]">
      <Sidebar />
      <main className="flex-1 flex overflow-hidden">
        <Routes>
          <Route path="/"              element={<Dashboard />} />
          <Route path="/profile"       element={<ProfilePage />} />
          <Route path="/opportunities" element={<OpportunitiesPage />} />
          <Route path="/orders"        element={<OrdersPage />} />
           <Route
  path="/orders/:id"
  element={<OrderDetailsPage />}
/>
          <Route path="/earnings"      element={<EarningsPage />} />
          <Route path="/salah"         element={<SalahPage />} />
        </Routes>
      </main>
    </div>
  )
}

'use client'

import { useAuth } from '@/context/AuthContext'
import Sidebar from './Sidebar'
import ProtectedRoute from './ProtectedRoute'

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-main">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  )
}

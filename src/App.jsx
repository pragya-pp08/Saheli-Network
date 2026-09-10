import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OrdersPage from "./pages/OrdersPage";
import EarningsPage from "./pages/EarningsPage";
import SalahPage from "./pages/SalahPage";
import OrderDetailsPage from "./pages/OrderDetails";
import RecoverySupportPage from "./pages/RecoverySupportPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerJobsPage from "./pages/CustomerJobsPage";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./components/SplashScreen";
import FloatingPetals from "./components/FloatingPetals";
import { api } from "./services/api";

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col w-full overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);
  const [accountMode, setAccountMode] = useState(null);
  useEffect(() => onAuthStateChanged(auth, async user => {
    setIsLoggedIn(!!user);
    setAccountId(user?.uid || null);
    if (!user) {
      setAccountMode(null);
      setAuthLoading(false);
      return;
    }
    try {
      const summary = await api('/account-summary');
      setAccountMode(summary.accountMode || 'worker');
    } catch {
      setAccountMode('worker');
    } finally {
      setAuthLoading(false);
    }
  }), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleModeChange = (event) => setAccountMode(event.detail?.mode || 'worker');
    window.addEventListener('saheli-mode-changed', handleModeChange);
    return () => window.removeEventListener('saheli-mode-changed', handleModeChange);
  }, []);

  return (
    <>
      {/* Mounted once, persists across every page and never restarts */}
      <FloatingPetals />

      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && !authLoading && (
        <Routes>
          <Route
            path="/login"
            element={
              <PageTransition>
                  <LoginPage onLogin={(mode) => {
                    setIsLoggedIn(true);
                    if (mode) setAccountMode(mode);
                  }} />
                </PageTransition>
            }
          />

          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <div key={accountId} className="flex min-h-screen bg-[#FAF7F2]">
                  <Sidebar />

                  <main className="flex-1 flex overflow-hidden">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            {accountMode === 'customer' ? <CustomerDashboard /> : <Dashboard />}
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PageTransition>
                            <ProfilePage />
                          </PageTransition>
                        }
                      />
                      {accountMode === 'worker' && (
                        <Route path="/opportunities" element={<PageTransition><OpportunitiesPage /></PageTransition>} />
                      )}
                      {accountMode === 'customer' && (
                        <Route path="/customer-jobs" element={<PageTransition><CustomerJobsPage /></PageTransition>} />
                      )}
                      <Route
                        path="/orders"
                        element={
                          <PageTransition>
                            <OrdersPage />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/orders/:id"
                        element={
                          <PageTransition>
                            <OrderDetailsPage />
                          </PageTransition>
                        }
                      />
                      {accountMode === 'worker' && <>
                        <Route path="/earnings" element={<PageTransition><EarningsPage /></PageTransition>} />
                        <Route path="/salah" element={<PageTransition><SalahPage /></PageTransition>} />
                        <Route path="/recovery-support" element={<PageTransition><RecoverySupportPage /></PageTransition>} />
                      </>}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      )}
    </>
  );
}

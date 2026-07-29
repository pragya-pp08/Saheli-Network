import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OrdersPage from "./pages/OrdersPage";
import EarningsPage from "./pages/EarningsPage";
import SalahPage from "./pages/SalahPage";
import OrderDetailsPage from "./pages/OrderDetails";
import RecoverySupportPage from "./pages/RecoverySupportPage";
import LoginPage from "./pages/LoginPage";
import SplashScreen from "./components/SplashScreen";
import FloatingPetals from "./components/FloatingPetals";

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Mounted once, persists across every page and never restarts */}
      <FloatingPetals />

      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && (
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <PageTransition>
                  <LoginPage onLogin={() => setIsLoggedIn(true)} />
                </PageTransition>
              )
            }
          />

          <Route
            path="/*"
            element={
              isLoggedIn ? (
                <div className="flex min-h-screen bg-[#FAF7F2]">
                  <Sidebar />

                  <main className="flex-1 flex overflow-hidden">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <PageTransition>
                            <Dashboard />
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
                      <Route
                        path="/opportunities"
                        element={
                          <PageTransition>
                            <OpportunitiesPage />
                          </PageTransition>
                        }
                      />
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
                      <Route
                        path="/earnings"
                        element={
                          <PageTransition>
                            <EarningsPage />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/salah"
                        element={
                          <PageTransition>
                            <SalahPage />
                          </PageTransition>
                        }
                      />
                      <Route
                        path="/recovery-support"
                        element={
                          <PageTransition>
                            <RecoverySupportPage />
                          </PageTransition>
                        }
                      />
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
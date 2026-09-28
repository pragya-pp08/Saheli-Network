import React, { lazy, Suspense, useState, useEffect, useCallback, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";
import FloatingPetals from "./components/FloatingPetals";
import { api } from "./services/api";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const EarningsPage = lazy(() => import("./pages/EarningsPage"));
const SalahPage = lazy(() => import("./pages/SalahPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetails"));
const RecoverySupportPage = lazy(() => import("./pages/RecoverySupportPage"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const CustomerJobsPage = lazy(() => import("./pages/CustomerJobsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));

function LoadingScreen() {
  return <div className="flex flex-1 items-center justify-center bg-[#FAF7F2] text-sm text-gray-500">Loading...</div>;
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col w-full overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem("saheli-splash-seen") !== "1"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [accountId, setAccountId] = useState(null);
  const [accountMode, setAccountMode] = useState(null);
  const [accountError, setAccountError] = useState("");
  const modeRequest = useRef(0);

  const syncAccountMode = useCallback(async ({ retries = 0 } = {}) => {
    const requestId = ++modeRequest.current;
    setAccountError("");
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const summary = await api('/account-summary');
        if (requestId === modeRequest.current) {
          setAccountMode(summary.accountMode || 'worker');
          setAccountError("");
        }
        return;
      } catch (error) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 300 * (attempt + 1)));
          continue;
        }
        if (requestId === modeRequest.current) setAccountError(error.message);
      }
    }
  }, []);

  useEffect(() => onAuthStateChanged(auth, async user => {
    setIsLoggedIn(!!user);
    setAccountId(user?.uid || null);
    if (!user) {
      modeRequest.current += 1;
      setAccountMode(null);
      setAccountError("");
      setAuthLoading(false);
      return;
    }
    setAuthLoading(true);
    await syncAccountMode({ retries: 4 });
    setAuthLoading(false);
  }), [syncAccountMode]);

  useEffect(() => {
    if (!showSplash) return undefined;
    const timer = setTimeout(() => {
      sessionStorage.setItem("saheli-splash-seen", "1");
      setShowSplash(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, [showSplash]);

  useEffect(() => {
    const handleModeChange = (event) => setAccountMode(event.detail?.mode || 'worker');
    const refreshMode = () => syncAccountMode({ retries: 2 });
    window.addEventListener('saheli-mode-changed', handleModeChange);
    window.addEventListener('saheli-refresh-account-mode', refreshMode);
    return () => {
      window.removeEventListener('saheli-mode-changed', handleModeChange);
      window.removeEventListener('saheli-refresh-account-mode', refreshMode);
    };
  }, [syncAccountMode]);

  return (
    <>
      {/* Mounted once, persists across every page and never restarts */}
      <FloatingPetals />

      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!showSplash && !authLoading && (
        <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route
            path="/login"
            element={
              <PageTransition>
                  <LoginPage onLogin={(mode) => {
                    setIsLoggedIn(true);
                    if (mode) {
                      modeRequest.current += 1;
                      setAccountMode(mode);
                      setAccountError("");
                    }
                  }} />
                </PageTransition>
            }
          />

          <Route
            path="/*"
            element={
              isLoggedIn && accountError ? (
                <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center gap-3 px-6 text-center">
                  <p className="text-sm text-red-500" role="alert">{accountError}</p>
                  <button
                    type="button"
                    onClick={async () => {
                      setAuthLoading(true);
                      await syncAccountMode({ retries: 2 });
                      setAuthLoading(false);
                    }}
                    className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-600"
                  >
                    Try again
                  </button>
                </div>
              ) : isLoggedIn && accountMode ? (
                <div key={accountId} className="flex min-h-screen bg-[#FAF7F2]">
                  <Sidebar accountMode={accountMode || 'worker'} />

                  <main className="flex-1 flex overflow-hidden pt-16 pb-20 md:pt-0 md:pb-0 min-w-0">
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
                      <Route path="/opportunities" element={<PageTransition>{accountMode === 'customer' ? <CustomerJobsPage /> : <OpportunitiesPage />}</PageTransition>} />
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
                      <Route path="/earnings" element={<PageTransition><EarningsPage /></PageTransition>} />
                      <Route path="/salah" element={<PageTransition><SalahPage /></PageTransition>} />
                      <Route path="/recovery-support" element={<PageTransition><RecoverySupportPage /></PageTransition>} />
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
        </Suspense>
      )}
    </>
  );
}

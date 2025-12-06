import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { UserData, PackageDetails, UserDetails, OrderDetails } from './types';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth Components
import LoginModal from './components/auth/LoginModal';

// Dashboard Component
import UserDashboard from './components/dashboard/UserDashboard';

// Flow Components
import PackageSelectionFlow from './components/flow/PackageSelectionFlow';
import OrderConfirmation from './components/flow/OrderConfirmation';
import Hero from './sections/Hero';
import FlowSection from './sections/FlowSection';
import PackagesSection from './sections/PackagesSection';
import BenefitsSection from './sections/BenefitsSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';

type View =
  | 'landing'
  | 'packageflow'
  | 'checkout'
  | 'confirmation'
  | 'dashboard';

const App: React.FC = () => {

  const [user, setUser] = useState<UserData | null>(null);
  const [hasRegistered, setHasRegistered] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, _setAuthMode] = useState<'login' | 'register'>('login');

  const [view, setView] = useState<View>('landing');
  const [selectedPackage, setSelectedPackage] = useState<PackageDetails | null>(null);
  const [checkoutUser, setCheckoutUser] = useState<UserDetails | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  console.log(checkoutUser);
  useEffect(() => {
    const registered = !!localStorage.getItem('srkgrow-hasregistered');
    setHasRegistered(registered);

    const savedUser = localStorage.getItem('srkgrow-activesession');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
  }, []);

  const handleUserUpdate = (userData: UserData | null) => {
    setUser(userData);
    localStorage.setItem("srkgrow_loggedInUser", JSON.stringify(userData));
  };

  const handleLoginSuccess = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem('srkgrow-activesession', JSON.stringify(userData));
    setHasRegistered(true);
    setView('dashboard');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('srkgrow-activesession');
    setView('landing');
  };

  const handlePackageSelect = (pkg: PackageDetails) => {
    setSelectedPackage(pkg);
    setView('packageflow');
    window.scrollTo(0, 0);
  };

  const handlePackageFlowComplete = (details: UserDetails) => {
    setCheckoutUser(details);
    setView('checkout');
    window.scrollTo(0, 0);
  };



  const handleBackToLanding = () => {
    setView('landing');
    setSelectedPackage(null);
    setCheckoutUser(null);
    setOrderDetails(null);
  };

  return (
    <>
      <Navbar
        user={user}
        onUserUpdate={handleUserUpdate}
        onDashboardClick={() => setView('dashboard')}


      />

      <AnimatePresence>
        {showAuthModal && (
          <LoginModal
            initialMode={authMode}
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={handleLoginSuccess}
            hasRegistered={hasRegistered}
            onRegistrationComplete={() => setHasRegistered(true)}
          />
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <>
              <Hero />
              <FlowSection />
              <PackagesSection onPackageSelect={handlePackageSelect} />
              <BenefitsSection />
              <FAQSection />
              <CTASection onPackageSelect={handlePackageSelect} />
              <Footer />
            </>
          )}

          {view === 'packageflow' && selectedPackage && (
            <PackageSelectionFlow
              selectedPackage={selectedPackage}
              onBack={handleBackToLanding}
              onComplete={handlePackageFlowComplete}
            />
          )}

          {view === 'confirmation' && orderDetails && (
            <OrderConfirmation orderDetails={orderDetails} onBack={handleBackToLanding} />
          )}

          {view === 'dashboard' && user && (
            <UserDashboard user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>
    </>
  );
};

export default App;

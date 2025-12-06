import React from "react";
import { Route, Routes } from "react-router-dom";
import TaskLandingPage from "./srktaskpremium/Task";
import GrowOnlyAdminDashboard from "./growonly/GrowOnlyAdminDashboard";
import GrowDashboard from "./growonly/GrowDashboard";
import AfterVerified from "./srktaskpremium/afterVerification";
import Dashboard from "./srktaskpremium/Dashboard/Dashboard";
import TaskVerificationPage from "./srktaskpremium/TaskVerification";
import GrowVerificationPage from "./growonly/GrowVerification";
import PackageSelectionPage from "./Package/App";
const App: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Routes>
        <Route path="/taskLanding" element={<TaskLandingPage/>} />
        <Route path="/" element={<PackageSelectionPage/>} />
        <Route
          path="/growadmindashboard"
          element={<GrowOnlyAdminDashboard />}
        />
        <Route path="/growdashboard" element={<GrowDashboard />} />
        <Route path="/afterVerified" element={<AfterVerified />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/taskVerification" element={<TaskVerificationPage/>}/>
        <Route path="/growVerification" element={<GrowVerificationPage/>}/>
      </Routes>
    </div>
  );
};

export default App;

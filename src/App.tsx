import React from "react";
import { Route, Routes } from "react-router-dom";
import TaskLandingPage from "./srktask/Task";
import GrowOnlyAdminDashboard from "./growonly/GrowOnlyAdminDashboard";
import GrowDashboard from "./growonly/GrowDashboard";
import AfterVerified from "./srktask/afterVerification";
import Dashboard from "./srktask/Dashboard/Dashboard";
import TaskVerificationPage from "./srktask/TaskVerification";
import GrowVerificationPage from "./growonly/GrowVerification";
import PackageSelectionPage from "./Package/App";
import VerificationReviewPage from "./srktask/afterVerification/VerificationReviewPage";
import UserDashboard from "./Package/components/dashboard/UserDashboard";
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
        <Route path ="/underVerification" element={<VerificationReviewPage/>}/>
 <Route path="/userDashboard" element={<UserDashboard />} />
      </Routes>
    </div>
  );
};

export default App;

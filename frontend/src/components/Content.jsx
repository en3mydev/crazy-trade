import { Route, Routes, Outlet } from "react-router-dom";
import Trade from "./Trade";
import Wallet from "./Wallet";
import Profile from "./Profile";
import DashboardContent from "./DashboardContent";

const Content = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <div>
            <Outlet />
          </div>
        }
      />
      <Route index element={<DashboardContent />} />
      <Route path="/trade" element={<Trade />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Content;

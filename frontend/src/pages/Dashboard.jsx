import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import SideMenu from "../components/SideMenu";
import Content from "../components/Content";
import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://crazy-trade-server.vercel.app/user/${userId}`,
          { withCredentials: true }
        );
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <>
      {dataLoaded ? (
        <div className="dashboard-page">
          <DashboardHeader />
          <div className="dashboard-mid">
            <SideMenu className="sidemenu" />
            <Content />
          </div>
          <Footer />
        </div>
      ) : (
        <div className="dashboard">
          <div class="loader">
            <li class="ball"></li>
            <li class="ball"></li>
            <li class="ball"></li>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;

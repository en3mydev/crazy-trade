import axios from "axios";
import { useEffect, useState } from "react";
import "./DashboardContent.css";
import {
  UpCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import bitcoinimg from "../images/cryptoimage/bitcoin.png";
import WatchlistTable from "./WatchlistTable";
import YourAssetsTable from "./YourAssetsTable";

const DashboardContent = () => {
  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://crazy-trade-server.vercel.app/user/${userId}`,
          { withCredentials: true }
        );

        setUserProfile(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h1>
          Welcome, {userProfile.firstName} {userProfile.lastName}!
        </h1>
        <h2>Balance: ${parseFloat(userProfile.balance).toFixed(2)}</h2>
      </div>
      <div className="get-started">
        <div className="get-started-title">
          <h2>Get Started with Bitcoin </h2>
          <img src={bitcoinimg} alt="bitcoin" width={30} />
        </div>

        <div className="get-started__content">
          <div className="get-started__content__left">
            <ul>
              <li>
                <UpCircleOutlined /> The world's #1 cryptocurrency
              </li>
              <li>
                <ClockCircleOutlined /> Trade 24 hours a day
              </li>
              <li>
                <CreditCardOutlined /> Get started with as little as $5
              </li>
            </ul>
          </div>
        </div>
      </div>
      <YourAssetsTable userProfile={userProfile} dataLoaded={dataLoaded} />
      <WatchlistTable />
    </div>
  );
};

export default DashboardContent;

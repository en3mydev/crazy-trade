import { useEffect, useState } from "react";
import DepositButton from "./DepositButton";
import "./Wallet.css";
import YourAssetsTableWithSell from "./YourAssetsTableWithSell";
import axios from "axios";
import WithdrawButton from "./WithdrawButton";
const Wallet = () => {
  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(
          `https://crazy-trade-server.vercel.app/user/${userId}`
        );

        setUserProfile(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
  }, []);

  const classN = "wallet-deposit-button";

  return (
    <div className="wallet-page">
      <div className="wallet-page__content">
        <div className="wallet-page__content__left">
          <h2>Wallet</h2>
          <p className="wallet-first-p">
            Your wallet is where you can manage your cryptocurrency holdings.
          </p>
          <p className="wallet-second-p">
            The ballance you can withdraw:{" "}
            <span>${parseFloat(userProfile.balance).toFixed(2)}</span>
          </p>
        </div>
        <div className="wallet-page__content__right">
          <div className="wallet-page-buttons">
            <DepositButton classN={classN} />
            <WithdrawButton />
          </div>
          <p className="text-before-assets">
            You have to sell your cryptocurrency in order to withdraw more
            money.
          </p>
          <YourAssetsTableWithSell
            userProfile={userProfile}
            dataLoaded={dataLoaded}
          />
        </div>
      </div>
    </div>
  );
};

export default Wallet;

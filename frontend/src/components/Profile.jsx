import { set } from "mongoose";
import CryptoTradeHistory from "./CryptoTradeHistory";
import "./Profile.css";
import TransactionHistory from "./TransactionHistory";
import axios from "axios";
import { useEffect, useState } from "react";

const Profile = () => {
  const [userProfile, setUserProfile] = useState({});
  const [dataLoaded, setDataLoaded] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [displayForm, setDisplayForm] = useState("change-password-form");
  const [displayWithdraw, setDisplayWithdraw] = useState(
    "withdraw-details-form"
  );

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post(`https://crazy-trade-server.vercel.app/changepassword/`, {
        userId: userProfile._id,
        oldPassword,
        newPassword,
      });
      setMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setMessage(error.response.data.message);
    }
  };

  const handleDisplay = () => {
    if (displayForm === "change-password-form") {
      setDisplayForm("change-password-form display");
      setDisplayWithdraw("withdraw-details-form");
    } else {
      setDisplayForm("change-password-form");
    }
  };

  const handleDisplayWithdraw = () => {
    if (displayWithdraw === "withdraw-details-form") {
      setDisplayWithdraw("withdraw-details-form display");
      setDisplayForm("change-password-form");
    } else {
      setDisplayWithdraw("withdraw-details-form");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <p>Welcome to your profile, {userProfile.firstName}!</p>
      </div>
      <div className="profile-buttons">
        <button onClick={handleDisplay}>Change Password</button>
        <button onClick={handleDisplayWithdraw}>Update Withdraw Details</button>
      </div>
      <div className="profile-content">
        <div className="form-group">
          <form className={displayForm}>
            {message ? <p>{message}</p> : null}
            <div id="passinput" className="input-group">
              <label htmlFor="old-password">Old password</label>
              <input
                type="password"
                id="old-password"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <label htmlFor="new-password">New password</label>
              <input
                type="password"
                id="new-password"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label htmlFor="confirm-password">Confirm new password</label>
              <input
                type="password"
                id="confirm-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button onClick={handleChangePassword} type="submit">
              Change password
            </button>
          </form>
          <div className="withdraw-details">
            <form className={displayWithdraw}>
              <div className="input-group">
                <p>Update your withdraw details:</p>
                <label htmlFor="iban">IBAN</label>
                <input
                  type="text"
                  id="iban"
                  placeholder="RO66BACX0000001234567890"
                />

                <label htmlFor="bank">Bank</label>
                <input type="text" id="bank" placeholder="BCR" />

                <label htmlFor="swift">SWIFT</label>
                <input type="text" id="swift" placeholder="RNCBROBU" />

                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  placeholder="Bucharest, Splai Independentei"
                />

                <label htmlFor="city">City</label>
                <input type="text" id="city" placeholder="Bucharest" />

                <label htmlFor="country">Country</label>
                <input type="text" id="country" placeholder="Romania" />

                <label htmlFor="phone">Phone</label>
                <input type="text" id="phone" placeholder="+40721234567" />
              </div>
              <button type="submit">Update details</button>
            </form>
          </div>
        </div>
        <div className="transaction-history">
          <TransactionHistory userProfile={userProfile} />
          <CryptoTradeHistory />
        </div>
      </div>
    </div>
  );
};

export default Profile;

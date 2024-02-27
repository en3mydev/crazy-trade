import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  };

  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header__left">
        <Link to="/">CrazyTrade</Link>
      </div>
      <div className="header__middle">
        <Link to="dashboard/trade">Trade</Link>
        <Link to="dashboard/wallet">Wallet</Link>
        <Link to="contact">Support</Link>
      </div>
      {isLoggedIn ? (
        <div className="header__right">
          <Link to="dashboard" className="login-button">
            Dashboard
          </Link>
          <button className="register-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="header__right">
          <Link to="login" className="login-button">
            Login
          </Link>
          <Link to="register" className="register-button">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default Header;

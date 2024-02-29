import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useEffect, useState } from "react";
import { FaX } from "react-icons/fa6";
import { IoMenu } from "react-icons/io5";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nav, setNav] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    navigate("/");
  };

  const openNav = () => {
    setNav(!nav);
  }

  return (
<>
    {/* mobile */}
    <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar__close">
          <FaX width={30} height={30} />
        </div>
        {isLoggedIn ? (
          <ul className="mobile-navbar__links">
            <li>
              <Link onClick={openNav} to="dashboard/trade">
                Trade
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="dashboard/wallet">
                Wallet
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="contact">
                Support
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="dashboard">
              Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={() => {
                  handleLogout();
                  openNav();
                }}
              >
                Log Out
              </Link>
            </li>
          </ul>
        ) : (
          <ul className="mobile-navbar__links">
            <li>
              <Link onClick={openNav} to="dashboard/trade">
                Trade
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="dashboard/wallet">
                Wallet
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="contact">
                Support
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="register">
                Register
              </Link>
            </li>
            <li>
              <Link onClick={openNav} to="login">
                Login
              </Link>
            </li>
          </ul>
        )}
      </div>

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
            Register
          </Link>
        </div>
      )}
      <div className="mobile-hamb" onClick={openNav}>
          <IoMenu width={30} height={30} />
    </div>
    </div>
    </>
  );
};

export default Header;

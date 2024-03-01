import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://crazy-trade-server.vercel.app/login",
        {
          email: loginEmail,
          password: loginPassword,
        },
      );

      if (response.status === 200) {
        const { token, userId } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        navigate("/dashboard");
      } else {
        console.error("Authentication error");
      }
    } catch (error) {
      console.error("Authentication error", error);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-header">
          <div className="login-header__left">
            <Link to="/">CrazyTrade</Link>
          </div>
          <div className="login-header__middle">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </div>
          <div className="login-header__right"></div>
        </div>
        <div className="login-body">
          <form className="login-form">
            <h2>Log in</h2>
            <input
              type="email"
              placeholder="Enter your email adress"
              className="login-email"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter your password"
              className="login-password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button onClick={handleLogin}>
              Continue <FaArrowRight />
            </button>
          </form>
          <p className="forgot-password">
            <Link to="/recover-account">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;

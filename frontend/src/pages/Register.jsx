import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const formatText = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("https://crazy-trade-server.vercel.app/register", {
        firstName: formatText(firstName),
        lastName: formatText(lastName),
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="register-page">
        <div className="register-header">
          <div className="register-header__left">
            <Link to="/">CrazyTrade</Link>
          </div>
          <div className="register-header__middle">
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </div>
          <div className="register-header__right"></div>
        </div>
        <div className="register-body">
          <form action="POST" className="register-form">
            <h2>Create an account</h2>
            <div className="register-form__name">
              <input
                type="text"
                placeholder="Enter first name"
                className="input-firstname"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter last name"
                className="input-lastname"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <input
              type="email"
              placeholder="What's your email adress"
              className="register-email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Create a password"
              className="register-password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>
              Continue <FaArrowRight />
            </button>
          </form>
          <p className="have-account">
            Do you have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;

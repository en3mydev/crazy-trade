import { Link } from "react-router-dom";
import HeroIMG from "../images/homepage/iphonehero.png";
import "./Hero.css";

const Hero = () => {
  return (
    <div className="hero-content">
      <div className="hero-text">
        <h1>Welcome to CrazyTrade - Your Gateway to the Crypto Universe!</h1>
        <p>Join us and experience the future of finance at your fingertips.</p>
        <form className="hero-form">
          <input
            type="text"
            placeholder="Enter your email address"
            className="hero-input"
            autoComplete="off"
          />
          <Link to="register" className="hero-button">Get Started</Link>
        </form>
      </div>
      <img src={HeroIMG} alt="hero" className="hero-img" />
    </div>
  );
};

export default Hero;

import "./Footer.css";
import { Link } from "react-router-dom";
import logoImage from "../images/homepage/ctlogo.png";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__left">
        <Link to="/">
          <img src={logoImage} alt="logo" />
        </Link>
        <p>© 2024 CrazyTrade</p>
      </div>
      <div className="footer__right">
        <Link to="/">Terms of Use</Link>
        <Link to="/">Privacy Policy</Link>
        <Link to="/">Fees</Link>
        <Link to="/">Affiliates</Link>
        <Link to="/">Careers</Link>
        <Link to="/">Help Center</Link>
        <Link to="/">Download App</Link>
      </div>
    </div>
  );
};

export default Footer;

import { Link } from "react-router-dom";
import "./BannerExplore.css";
import CrpytoCard from "./CryptoCard";

const BannerExplore = () => {
  return (
    <div className="banner-explore">
      <div className="banner-explore__left">
        <h1>Explore crypto like Bitcoin, Ethereum, and Dogecoin</h1>
        <h2>
          Simply and securely buy, sell, and manage hundreds of
          cryptocurrencies.
        </h2>
        <Link to="explore" className="banner-explore__btn">
          See more assets
        </Link>
      </div>
      <div className="banner-explore__right">
        <CrpytoCard name="bitcoin" />
        <CrpytoCard name="ethereum" />
        <CrpytoCard name="tether" />
        <CrpytoCard name="dogecoin" />
        <CrpytoCard name="solana" />
        <CrpytoCard name="litecoin" />
      </div>
    </div>
  );
};

export default BannerExplore;

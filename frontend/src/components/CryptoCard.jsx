import { FaArrowDown } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa6";
import "./CryptoCard.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

const CrpytoCard = ({ name }) => {
  const [cryptoImg, setCryptoImg] = useState("");
  const [cryptoPrice, setCryptoPrice] = useState("");
  const [cryptoName, setCryptoName] = useState("");
  const [cryptoPercentage, setCryptoPercentage] = useState(0);

  const cryptoData = useCallback(async () => {
    try {
      const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${name}&order=market_cap_desc&sparkline=false&price_change_percentage=24h&x_cg_demo_api_key=CG-R8ixrSUVUi84NCA9JyGPiAA3`;

      const res = await fetch(apiUrl);

      if (res.ok) {
        const data = await res.json();
        setCryptoImg(data[0].image);
        setCryptoPrice(data[0].current_price.toFixed(2));
        setCryptoName(data[0].name);
        setCryptoPercentage(data[0].price_change_percentage_24h.toFixed(2));
      } else {
        console.error(`HTTP error! Status: ${res.status}`);
        console.log("Error response text:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  }, [name]);

  const isCryptoUp = cryptoPercentage > 0;

  useEffect(() => {
    cryptoData();
  }, [cryptoData]);

  return (
    <Link to={`${name}`} className="crypto-btn">
      <img src={cryptoImg} alt="" />
      <h3>{cryptoName}</h3>
      <h4>${cryptoPrice}</h4>
      {isCryptoUp ? (
        <div className="cryptosymbol crypto-up">
          <FaArrowUp className="arw" />
          {cryptoPercentage}%
        </div>
      ) : (
        <div className="cryptosymbol crypto-down">
          <FaArrowDown className="arw" /> {cryptoPercentage}%
        </div>
      )}
    </Link>
  );
};

export default CrpytoCard;

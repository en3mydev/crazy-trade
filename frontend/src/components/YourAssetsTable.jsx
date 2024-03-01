import { Table } from "antd";
import { useEffect, useState } from "react";

const YourAssetsTable = ({ userProfile, dataLoaded }) => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    if (dataLoaded) {
      const symbolsId = userProfile.crypto
        .map((crypto) => {
          if (crypto.coinId === "XRP") {
            crypto.coinId = "ripple";
          } else if (crypto.coinId === "BNB") {
            crypto.coinId = "binancecoin";
          }
          return crypto.coinId;
        })
        .join(",");
      fetchCryptoData(symbolsId);
    }
  }, [userProfile, dataLoaded]);

  const fetchCryptoData = async (symbolsId) => {
    try {
      const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${symbolsId}&vs_currencies=usd&x_cg_demo_api_key=CG-R8ixrSUVUi84NCA9JyGPiAA3`;
      const res = await fetch(apiUrl);

      if (res.ok) {
        const data = await res.json();
        setCryptoData(data);
      } else {
        console.error(`HTTP error! Status: ${res.status}`);
        console.log("Error response text:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  const cryptoPriceView = (cryptoP) => {
    if (cryptoP < 1) {
      return cryptoP.toFixed(5);
    } else {
      return cryptoP.toFixed(2);
    }
  };

  const assets = (userProfile.crypto || [])
    .filter((asset) => asset.amount > 0)
    .map((asset) => {
      const duplicateCoinId =
        asset.coinId === "XRP"
          ? "ripple"
          : asset.coinId === "BNB"
          ? "binancecoin"
          : asset.coinId.toLowerCase();

      const cryptoPrice = cryptoData[duplicateCoinId]?.usd || 0;

      const lastCheck = (coincheck) => {
        if (coincheck === "ripple") {
          return "XRP";
        } else if (coincheck === "binancecoin") {
          return "BNB";
        }
        return coincheck;
      };

      return {
        key: asset.coinId,
        symbol: lastCheck(asset.coinId),
        balance: asset.amount,
        price: cryptoPriceView(cryptoPrice),
        total: `$${(cryptoPrice * asset.amount).toFixed(2)}`,
      };
    });

  return (
    <div className="assets-table">
      <h2>Your Assets</h2>
      <Table columns={columns} dataSource={assets} className="table-assets"/>
    </div>
  );
};

export default YourAssetsTable;

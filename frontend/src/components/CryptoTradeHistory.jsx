import { Table } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const CryptoTradeHistory = () => {
  const [history, setHistory] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://crazy-trade-server.vercel.app/trade-history/${userId}`,
          { withCredentials: true }
        );
        setHistory(response.data);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching trade history:", error);
      }
    };
    fetchData();
  }, []);

  const dateConvert = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
  };

  const sortTransactionsByNewest = (transactions) => {
    return transactions?.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  sortTransactionsByNewest(history);

  const data = history.map((item) => {
    return {
      key: item._id,
      date: dateConvert(item.date),
      type: item.type,
      coin: item.coinId,
      cryptoValue: item.cryptoValue,
      amount: `$${item.amount}`,
    };
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Coin",
      dataIndex: "coin",
      key: "coin",
    },
    {
      title: "Crypto Value",
      dataIndex: "cryptoValue",
      key: "cryptoValue",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
  ];

  return (
    <div className="crypto-trade-history-table">
      <h2>Trade History</h2>
      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default CryptoTradeHistory;

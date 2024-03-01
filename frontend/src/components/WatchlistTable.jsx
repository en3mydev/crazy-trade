import React, { useEffect, useState } from "react";
import { Input, Modal, Table } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WatchlistTable = () => {
  const [cryptoDataList, setCryptoDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topCryptoIds = [
          "bitcoin",
          "ethereum",
          "ripple",
          "litecoin",
          "cardano",
          "polkadot",
          "binancecoin",
          "chainlink",
          "stellar",
          "dogecoin",
        ];
        const idString = topCryptoIds.join(",");
        const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${idString}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;

        const res = await fetch(apiUrl);
        if (res.ok) {
          const cryptoData = await res.json();

          const data = cryptoData.map((coin, index) => {
            const marketCapChange = (marketData) => {
              if (marketData > 1000000000) {
                return (marketData / 1000000000).toFixed(2) + "B";
              } else if (marketData > 1000000) {
                return (marketData / 1000000).toFixed(2) + "M";
              }
              return marketData;
            };

            const changeColor =
              coin.price_change_percentage_24h > 0 ? "green" : "red";

            const priceCheck = (price) => {
              if (price > 1000) {
                return price.toFixed(2);
              } else if (price > 10000) {
                return price.toFixed(0);
              } else if (price > 1) {
                return price.toFixed(4);
              } else {
                return price.toFixed(6);
              }
            };

            const symbolAndImage = (cdata) => {
              return (
                <div className="symbol-and-image" key={index}>
                  <h3>{cdata.name}</h3>
                  <img src={cdata.image} alt={cdata} width={25} />
                </div>
              );
            };

            return {
              key: index,
              symbol: symbolAndImage(coin),
              price: `$${priceCheck(coin.current_price)}`,
              change: (
                <span style={{ color: changeColor }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              ),
              marketCap: marketCapChange(coin.market_cap),
            };
          });

          setCryptoDataList(data);
        } else {
          console.error(`HTTP error! Status: ${res.status}`);
          console.log("Error response text:", await res.text());
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("https://crazy-trade-server.vercel.app/transfer", {
        amount: modalInputDollars,
        userId: userId,
        transferType: "buy",
        coinId: selectedCoin?.symbol?.props?.children[0]?.props?.children,
        cryptoValue: modalInputDollars / selectedCoin.price.slice(1),
      });
      setIsModalOpen(false);

      navigate("/dashboard/wallet");
      setTimeout(() => navigate("/dashboard"), 1);
    } catch (error) {
      console.error("Error buying crypto:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [selectedCoin, setSelectedCoin] = useState({});

  const handleBuyAction = (record) => {
    setSelectedCoin(record);
    showModal();
  };

  const columns = [
    {
      title: "Symbol",
      dataIndex: "symbol",
      key: "symbol",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text, record) => <span>{record.price}</span>,
    },
    {
      title: "Change",
      dataIndex: "change",
      key: "change",
      render: (text, record) => <span>{record.change}</span>,
    },
    {
      title: "Market Cap",
      dataIndex: "marketCap",
      key: "marketCap",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <button
          className="table-buy-button"
          onClick={() => handleBuyAction(record)}
        >
          Buy
        </button>
      ),
    },
  ];

  const [modalInput, setModalInput] = useState(0);
  const [modalInputDollars, setModalInputDollars] = useState(0);

  const handleModalInputChange = (e) => {
    setModalInputDollars(e.target.value);
    setModalInput((e.target.value / selectedCoin.price.slice(1)).toFixed(8));
  };

  return (
    <div className="watchlist-table">
      <h2>Watchlist</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Table columns={columns} dataSource={cryptoDataList}></Table>
          <Modal
            title={`Buy ${selectedCoin?.symbol?.props?.children[0]?.props?.children}`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
          >
            <p>
              Enter the amount of dollars you want to spend on{" "}
              {selectedCoin?.symbol?.props?.children[0]?.props?.children}
              <br />
              {`$100 = ${
                selectedCoin?.price ? 100 / selectedCoin.price.slice(1) : "N/A"
              }`}
            </p>
            <div className="modal-amount">
              <Input
                placeholder="Amount"
                onChange={handleModalInputChange}
                type="number"
              />
              <output>
                = <span> </span>
                {modalInput}
              </output>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default WatchlistTable;

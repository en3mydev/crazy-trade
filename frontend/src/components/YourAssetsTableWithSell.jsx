import { Table, Modal, Input } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const YourAssetsTableWithSell = ({ userProfile, dataLoaded }) => {
  const [cryptoData, setCryptoData] = useState([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState({});
  const [modalText, setModalText] = useState("How much do you want to sell?");
  const [modalInput, setModalInput] = useState(0);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const navigate = useNavigate();

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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div>
          <button
            className="table-sell-button"
            onClick={() => showSellModal(record)}
          >
            Sell
          </button>
        </div>
      ),
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

  const showSellModal = (record) => {
    setSelectedAsset(record);
    setIsSellModalOpen(true);
  };

  const handleModalInputChange = (e) => {
    if (e.target.value > selectedAsset.balance) {
      setModalText("Insufficient funds");
    } else {
      setModalText(`Balance: ${selectedAsset.balance}`);
      setModalInput(e.target.value);
    }
  };

  const handleSellCancel = () => {
    setModalText("How much do you want to sell?");
    setModalInput(0);
    setIsSellModalOpen(false);
  };

  const handleSellAfterTransfer = () => {
    setModalText("You have successfully sold!");
    setConfirmLoading(true);
    setTimeout(() => {
      setConfirmLoading(false);
      setIsSellModalOpen(false);
      setModalText("How much do you want to sell?");
      setModalInput(0);
    }, 3000);
    navigate("/dashboard");
  };

  const handleSellOk = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("https://crazy-trade-server.vercel.app/transfer", {
        amount: (modalInput * selectedAsset.price).toFixed(4),
        userId: userId,
        transferType: "sell",
        coinId: selectedAsset.symbol,
        cryptoValue: modalInput,
      });

      console.log("Sell successful");
      handleSellAfterTransfer();
    } catch (error) {
      console.error("Error selling crypto:", error);
      setModalText("Error selling crypto. Please try again.");
    }
  };

  return (
    <div className="assets-table">
      <h2>Your Assets</h2>
      <Table columns={columns} dataSource={assets} />

      <Modal
        title={`Sell ${selectedAsset?.symbol}`}
        open={isSellModalOpen}
        onOk={handleSellOk}
        confirmLoading={confirmLoading}
        onCancel={handleSellCancel}
        okButtonProps={{ disabled: modalText === "Insufficient funds" }}
        destroyOnClose
      >
        <p>{modalText}</p>
        <div className="modal-input-output">
          <Input
            placeholder="Amount"
            onChange={handleModalInputChange}
            type="number"
          />
          <output>= ${(modalInput * selectedAsset.price).toFixed(4)}</output>
        </div>
      </Modal>
    </div>
  );
};

export default YourAssetsTableWithSell;

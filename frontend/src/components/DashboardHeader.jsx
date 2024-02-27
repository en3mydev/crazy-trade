import { Link, useNavigate } from "react-router-dom";
import "./DashboardHeader.css";
import { Modal, Input, Select } from "antd";
import { useState } from "react";
import axios from "axios";

const DashboardHeader = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [inputDisabled, setInputDisabled] = useState(false);

  const navigate = useNavigate();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post("https://crazy-trade-server.vercel.app/deposit", {
        amount: depositAmount,
        userId: userId,
      });

      setModalText(`You have successfully deposited $${depositAmount}!`);
      setConfirmLoading(true);
      setInputDisabled(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        setModalText("");
        setInputDisabled(false);
        navigate("/dashboard/wallet");
        setTimeout(() => navigate("/dashboard"), 1);
      }, 3000);
    } catch (error) {
      console.error("Error depositing money:", error);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const items = [
    {
      key: "1",
      label: "USD",
    },
  ];

  const handleInputChange = (e) => {
    setDepositAmount(e.target.value);
  };

  return (
    <div className="dashboard-header">
      <div className="dashboard-header__left">
        <Link>CrazyTrade</Link>
      </div>
      <div className="dashboard-header__right">
        <button className="modal-button" onClick={showModal}>
          Deposit
        </button>
        <Modal
          title="Deposit"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Confirm Deposit"
          okButtonProps={{
            disabled: depositAmount <= 0,
          }}
          destroyOnClose={true}
        >
          <p>{modalText}</p>
          <div className="modal-content">
            <Input
              placeholder="Enter amount"
              maxLength={6}
              type="number"
              onChange={handleInputChange}
              disabled={inputDisabled}
              style={{ borderColor: "#26272b" }}
            />
            <Select
              labelInValue
              defaultValue={{ value: "USD" }}
              style={{ width: 120, borderBlockColor: "#26272b" }}
            >
              {items.map((item) => (
                <Select.Option key={item.key} value={item.label}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DashboardHeader;

import { useNavigate } from "react-router-dom";
import { Modal, Input, Select } from "antd";
import { useState } from "react";
import axios from "axios";

const WithdrawButton = () => {
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
      await axios.post("https://crazy-trade.vercel.app/withdraw", {
        amount: depositAmount,
        userId: userId,
      });

      setModalText(
        `You have successfully withdrawn the amount of $${depositAmount}!`
      );
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
    <>
      <button className="withdraw-button" onClick={showModal}>
        Withdraw
      </button>
      <Modal
        title="Withdraw Money"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Confirm Withdrawal"
        okButtonProps={{
          disabled: depositAmount <= 0,
        }}
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
    </>
  );
};

export default WithdrawButton;

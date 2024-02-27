import { Table } from "antd";

const TransactionHistory = ({ userProfile }) => {
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
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  let data = userProfile.transactions;

  const dateConvert = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
  };

  const sortTransactionsByNewest = (transactions) => {
    return transactions?.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  };

  sortTransactionsByNewest(data);

  if (data) {
    data = data.map((transaction, index) => {
      return {
        key: index,
        date: dateConvert(transaction.date),
        type: transaction.type,
        amount: `$${transaction.amount}`,
        status: "Completed",
      };
    });
  }

  return (
    <div className="transaction-history-table">
      <h2>Transaction History</h2>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default TransactionHistory;

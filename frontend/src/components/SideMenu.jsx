import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LineChartOutlined,
  WalletOutlined,
  UserOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Menu, ConfigProvider } from "antd";
import "./SideMenu.css";

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      key: "/dashboard",
      icon: <DashboardOutlined />,
    },
    {
      label: "Trade",
      key: "/dashboard/trade",
      icon: <LineChartOutlined />,
    },
    {
      label: "Wallet",
      key: "/dashboard/wallet",
      icon: <WalletOutlined />,
    },
    {
      label: "Profile",
      key: "/dashboard/profile",
      icon: <UserOutlined />,
    },
  ];

  const menuStyle = {
    fontSize: "20px",
  };

  const iconStyle = {
    fontSize: "20px",
    marginRight: "8px",
  };

  const designTokens = {
    components: {
      Menu: {
        itemActiveBg: "#f4f4f5",
        itemBg: "#fcfcfc",
        itemColor: "#26272b",
        itemSelectedColor: "#ffffff",
        itemSelectedBg: "#26272b",
        horizontalItemHoverColor: "#26272b",
        horizontalItemSelectedColor: "#26272b",
      },
    },
  };

  return (
    <>
      {/*mobile*/}
      <div className="side-menu-mobile">
        <ConfigProvider theme={designTokens}>
          <Menu
            onClick={({ key }) => navigate(key)}
            style={menuStyle}
            mode="horizontal"
            selectedKeys={[location.pathname]}
            className="mobile-menu"
          >
            {menuItems.map(({ label, key, icon }) => (
              <Menu.Item
                key={key}
                icon={React.cloneElement(icon, { style: iconStyle })}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu>
        </ConfigProvider>
      </div>

      {/*desktop*/}
      <div className="side-menu">
        <ConfigProvider theme={designTokens}>
          <Menu
            onClick={({ key }) => navigate(key)}
            style={menuStyle}
            mode="inline"
            selectedKeys={[location.pathname]}
          >
            {menuItems.map(({ label, key, icon }) => (
              <Menu.Item
                key={key}
                icon={React.cloneElement(icon, { style: iconStyle })}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu>
        </ConfigProvider>
      </div>
    </>
  );
};

export default SideMenu;

import React, { useState } from "react";
import { Menu, Layout } from "antd";
import { CalendarOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

export default function MainSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // TODO: Ovo bi trebalo možda izdići u App ili neki kontekst?
  const [currentSide, setCurrentSide] = useState("clients");

  const handleClick = (e) => {
    setCurrentSide(e.key);
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      onBreakpoint={onCollapse}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[currentSide]}
        onClick={handleClick}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="clients" icon={<UserOutlined />}>
          <Link to="/clients">Klijenti</Link>
        </Menu.Item>
        <Menu.Item key="cars" icon={<CarOutlined />}>
          <Link to="/cars">Vozila</Link>
        </Menu.Item>
        <Menu.Item key="reservations" icon={<CalendarOutlined />}>
          <Link to="/reservations">Rezervacije</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

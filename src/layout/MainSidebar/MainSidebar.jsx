import React, { useState } from "react";
import { Menu, Layout } from "antd";
import { CalendarOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

export default function MainSidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/clients">Klijenti</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CarOutlined />}>
          <Link to="/cars">Vozila</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<CalendarOutlined />}>
          <Link to="/reservations">Rezervacije</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

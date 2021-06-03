import React from "react";
import { Menu, Layout } from "antd";
import { CalendarOutlined, CarOutlined, UserOutlined } from "@ant-design/icons";

const { Sider } = Layout;

export default function MainSidebar() {
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          Klijenti
        </Menu.Item>
        <Menu.Item key="2" icon={<CarOutlined />}>
          Vozila
        </Menu.Item>
        <Menu.Item key="3" icon={<CalendarOutlined />}>
          Rezervacije
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

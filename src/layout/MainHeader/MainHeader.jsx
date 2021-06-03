import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Header } = Layout;

export default function MainHeader() {
  return (
    <Header className="header">
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">Home</Menu.Item>
        <SubMenu style={{ marginLeft: "auto" }} key="sub1" title="Dodaj">
          <Menu.Item key="2">Novog korisnika</Menu.Item>
          <Menu.Item key="3">Novo vozilo</Menu.Item>
          <Menu.Item key="4">
            <Link to="/reservations/create">Novu rezervaciju</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title="Jezik">
          <Menu.Item key="5">MNE</Menu.Item>
          <Menu.Item key="6">ENG</Menu.Item>
        </SubMenu>
        <Menu.Item key="7">Logout</Menu.Item>
      </Menu>
    </Header>
  );
}

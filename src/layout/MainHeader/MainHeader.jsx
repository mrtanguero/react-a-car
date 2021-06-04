import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;
const { Header } = Layout;

export default function MainHeader() {
  const [currentMain, setCurrentMain] = useState("home");

  // TODO: Možda ovo podići u App ili u neki kontekst?
  const handleClick = (e) => {
    setCurrentMain(e.key);
  };

  return (
    <Header className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={handleClick}
        defaultSelectedKeys={[currentMain]}
      >
        <Menu.Item key="home">Početna</Menu.Item>
        <SubMenu key="create" title="Dodaj">
          <Menu.Item key="create:client">Novog klijenta</Menu.Item>
          <Menu.Item key="create:car">Novo vozilo</Menu.Item>
          <Menu.Item key="create:reservation">
            <Link to="/reservations/create">Novu rezervaciju</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="locale" title="Jezik">
          <Menu.Item key="locale:me">MNE</Menu.Item>
          <Menu.Item key="locale:eng">ENG</Menu.Item>
        </SubMenu>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu>
    </Header>
  );
}

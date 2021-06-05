import React, { useContext, useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import modalContext from "../../context/modalContext";
import NewCar from "../../components/NewCar/NewCar";
import NewClientForm from "../../components/NewClientForm/NewClientForm";

const { SubMenu } = Menu;
const { Header } = Layout;

export default function MainHeader() {
  const [currentMain, setCurrentMain] = useState("home");
  const modalCtx = useContext(modalContext);

  // TODO: Možda ovo podići u App ili u neki kontekst?
  const handleClick = (e) => {
    if (e.key === "create:car" || e.key === "create:client") {
      return;
    }
    setCurrentMain(e.key);
  };

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClickAddCar = () => {
    modalCtx.setModalProps({
      title: "Add new car",
      children: <NewCar />,
      visible: true,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleClickAddClient = () => {
    modalCtx.setModalProps({
      visible: true,
      title: "Dodaj novog korisnika",
      children: <NewClientForm />,
      onOk: () => {},
      onCancel: handleCancelModal,
    });
  };

  return (
    <Header className="header">
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={handleClick}
        selectedKeys={[currentMain]}
      >
        <Menu.Item key="home">Početna</Menu.Item>
        <SubMenu key="create" title="Dodaj">
          <Menu.Item key="create:client" onClick={handleClickAddClient}>
            Novog klijenta
          </Menu.Item>
          <Menu.Item key="create:car" onClick={handleClickAddCar}>
            Novo vozilo
          </Menu.Item>
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

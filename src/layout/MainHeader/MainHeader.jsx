import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import modalContext from '../../context/modalContext';
import NewCar from '../../components/NewCar/NewCar';
import NewClientForm from '../../components/NewClientForm/NewClientForm';
import MNEFlag from '../../components/MNEFlag/MNEFlag';
import GBFlag from '../../components/GBFlag/GBFlag';

const { SubMenu } = Menu;
const { Header } = Layout;

export default function MainHeader() {
  const [currentMain, setCurrentMain] = useState([null, 'locale:me']);
  const { pathname } = useLocation();
  const modalCtx = useContext(modalContext);

  useEffect(() => {
    switch (pathname) {
      case '/':
        setCurrentMain((current) => ['home', current[1]]);
        break;
      case '/reservations/create':
        setCurrentMain((current) => ['create:reservation', current[1]]);
        break;
      case '/login':
        setCurrentMain((current) => ['login', current[1]]);
        break;
      default:
        setCurrentMain((current) => [null, current[1]]);
        break;
    }
  }, [pathname]);

  const handleClick = (e) => {
    if (e.key === 'create:car' || e.key === 'create:client') {
      return;
    }
    if (e.key.split(':')[0] === 'locale') {
      setCurrentMain((current) => [current[0], e.key]);
    } else {
      setCurrentMain((current) => [e.key, current[1]]);
    }
  };

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClickAddCar = () => {
    modalCtx.setModalProps({
      title: 'Add new car',
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
      title: 'Dodaj novog korisnika',
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
        selectedKeys={currentMain}
      >
        <Menu.Item key="home">
          <Link to="/">Početna</Link>
        </Menu.Item>
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
        <SubMenu
          key="locale"
          title={currentMain[1] === 'locale:me' ? <MNEFlag /> : <GBFlag />}
        >
          <Menu.Item key="locale:me">Crnogorski (ME)</Menu.Item>
          <Menu.Item key="locale:eng">English (GB)</Menu.Item>
        </SubMenu>
        <Menu.Item key="logout">Logout</Menu.Item>
      </Menu>
    </Header>
  );
}

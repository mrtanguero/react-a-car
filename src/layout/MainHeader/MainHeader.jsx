import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import modalContext from '../../context/modalContext';
import ClientForm from '../../components/ClientForm/ClientForm';
import MNEFlag from '../../components/MNEFlag/MNEFlag';
import GBFlag from '../../components/GBFlag/GBFlag';
import { MenuOutlined } from '@ant-design/icons';
import { logout } from '../../services/account';
import MultiStepForm from '../../components/MultiStepForm/MultiStepForm';

const { SubMenu } = Menu;
const { Header } = Layout;

export default function MainHeader({
  drawerIsVisible,
  setDrawerIsVisible,
  user,
  setUser,
  setJwt,
}) {
  const [currentMain, setCurrentMain] = useState([null, 'locale:me']);
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const modalCtx = useContext(modalContext);
  const history = useHistory();

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
    if (
      e.key === 'create:car' ||
      e.key === 'create:client' ||
      e.key === 'menu-icon' ||
      e.key === 'logout'
    ) {
      return;
    }
    if (e.key.split(':')[0] === 'locale') {
      i18n.changeLanguage(e.key.split(':')[1]);
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
      title: t('modals.newCar'),
      children: <MultiStepForm closeModal={handleCancelModal} />,
      visible: true,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleClickAddClient = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newClient'),
      children: <ClientForm onCancel={handleCancelModal} />,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleLogout = () => {
    logout().then(() => {
      localStorage.removeItem('jwt');
      setJwt(null);
      setUser(null);
      history.push('/login');
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
        disabledOverflow={true}
        className="main-header-menu"
      >
        {user && (
          <>
            <Menu.Item key="home" className="main-header-home">
              <Link to="/">{t('navigation.home')}</Link>
            </Menu.Item>
            <SubMenu
              key="create"
              title={t('navigation.addNew')}
              className="main-header-create-submenu"
            >
              <Menu.Item key="create:client" onClick={handleClickAddClient}>
                {t('navigation.addNewClient')}
              </Menu.Item>
              <Menu.Item key="create:car" onClick={handleClickAddCar}>
                {t('navigation.addNewCar')}
              </Menu.Item>
              <Menu.Item key="create:reservation">
                <Link to="/reservations/create">
                  {t('navigation.addNewReservation')}
                </Link>
              </Menu.Item>
            </SubMenu>
          </>
        )}
        <SubMenu
          key="locale"
          title={currentMain[1] === 'locale:me' ? <MNEFlag /> : <GBFlag />}
        >
          <Menu.Item key="locale:me">[ME] Crnogorski</Menu.Item>
          <Menu.Item key="locale:en">[EN] English</Menu.Item>
        </SubMenu>
        {user && (
          <>
            <SubMenu
              key="user"
              className="main-header-user"
              title={user?.name?.split(' ')[0]}
            >
              <Menu.Item key="user:password-change">
                Promijeni lozinku
              </Menu.Item>
              <Menu.Item
                key="logout"
                className="main-header-logout"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </SubMenu>
            <Menu.Item
              key="menu-icon"
              className="hamburger-menu"
              onClick={() => setDrawerIsVisible(!drawerIsVisible)}
            >
              <MenuOutlined />
            </Menu.Item>
          </>
        )}
      </Menu>
    </Header>
  );
}

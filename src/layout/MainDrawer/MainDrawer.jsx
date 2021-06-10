import React, { useContext, useState } from 'react';
import {
  CalendarOutlined,
  CarOutlined,
  HomeOutlined,
  LockOutlined,
  LogoutOutlined,
  PlusOutlined,
  ProfileOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import NewCarContainer from '../../components/NewCarContainer/NewCarContainer';
import NewClientForm from '../../components/NewClientForm/NewClientForm';
import { logout } from '../../services/account';

const { SubMenu } = Menu;

export default function MainDrawer({
  drawerIsVisible,
  setDrawerIsVisible,
  user,
  setUser,
  setJwt,
}) {
  const [currentDrawer, setCurrentDrawer] = useState(['home']);
  const modalCtx = useContext(modalContext);
  const history = useHistory();
  const { t } = useTranslation();

  const handleCloseDrawer = () => {
    setDrawerIsVisible(false);
  };

  const handleClick = (e) => {
    setCurrentDrawer(e.key);
    handleCloseDrawer();
  };

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClickAddCar = () => {
    modalCtx.setModalProps({
      title: t('modals.newCar'),
      children: <NewCarContainer />,
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
      children: <NewClientForm />,
      onOk: () => {},
      onCancel: handleCancelModal,
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
    <Drawer
      className="main-drawer"
      visible={drawerIsVisible}
      onClose={handleCloseDrawer}
      closable={false}
      maskClosable={true}
    >
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={currentDrawer}
        onClick={handleClick}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/">{t('navigation.home')}</Link>
        </Menu.Item>
        <Menu.Item key="clients" icon={<UserOutlined />}>
          <Link to="/clients">{t('navigation.clients')}</Link>
        </Menu.Item>
        <Menu.Item key="cars" icon={<CarOutlined />}>
          <Link to="/cars">{t('navigation.vehicles')}</Link>
        </Menu.Item>
        <Menu.Item key="reservations" icon={<CalendarOutlined />}>
          <Link to="/reservations">{t('navigation.reservations')}</Link>
        </Menu.Item>
        <SubMenu
          key="create"
          icon={<PlusOutlined />}
          title={t('navigation.addNew')}
        >
          <Menu.Item
            key="create:client"
            icon={<UserAddOutlined />}
            onClick={handleClickAddClient}
          >
            {t('navigation.addNewClient')}
          </Menu.Item>
          <Menu.Item
            key="create:car"
            icon={<CarOutlined />}
            onClick={handleClickAddCar}
          >
            {t('navigation.addNewCar')}
          </Menu.Item>
          <Menu.Item key="create:reservation" icon={<CalendarOutlined />}>
            <Link to="/reservations/create">
              {t('navigation.addNewReservation')}
            </Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu
          key="user"
          icon={<ProfileOutlined />}
          title={user?.name?.split(' ')[0]}
        >
          <Menu.Item icon={<LockOutlined />} key="user:password-change">
            Promijeni lozinku
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Drawer>
  );
}

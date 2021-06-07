import React, { useContext, useState } from 'react';
import {
  CalendarOutlined,
  CarOutlined,
  HomeOutlined,
  LogoutOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import NewCarContainer from '../../components/NewCarContainer/NewCarContainer';
import NewClientForm from '../../components/NewClientForm/NewClientForm';

const { SubMenu } = Menu;

export default function MainDrawer({ drawerIsVisible, setDrawerIsVisible }) {
  const [currentDrawer, setCurrentDrawer] = useState(['home']);
  const modalCtx = useContext(modalContext);
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
        <Menu.Item key="logout" icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>
      </Menu>
    </Drawer>
  );
}

import React, { useEffect, useState } from 'react';
import { Menu, Layout } from 'antd';
import { CalendarOutlined, CarOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const { Sider } = Layout;

export default function MainSidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [currentSide, setCurrentSide] = useState(null);

  useEffect(() => {
    switch (pathname.split('/')[1]) {
      case 'clients':
        setCurrentSide('clients');
        break;
      case 'cars':
        setCurrentSide('cars');
        break;
      case 'reservations':
        setCurrentSide('reservations');
        break;
      default:
        setCurrentSide(null);
        break;
    }
  }, [pathname]);

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
        selectedKeys={[currentSide]}
        onClick={handleClick}
        style={{ height: '100%', borderRight: 0 }}
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

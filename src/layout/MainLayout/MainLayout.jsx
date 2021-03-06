import React, { useContext, useState } from 'react';
import { Layout } from 'antd';
import './MainLayout.css';

import MainHeader from '../MainHeader/MainHeader';
import MainSidebar from '../MainSidebar/MainSidebar';
import MainFooter from '../MainFooter/MainFooter';
import MainDrawer from '../MainDrawer/MainDrawer';
import authContext from '../../context/authContext';

const { Content } = Layout;

export default function MainLayout({ children }) {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);
  const auth = useContext(authContext);

  return (
    <Layout>
      <MainHeader
        auth={auth}
        drawerIsVisible={drawerIsVisible}
        setDrawerIsVisible={setDrawerIsVisible}
      />
      <Layout>
        {auth?.user?.roleId === 1 && <MainSidebar />}
        <Layout style={{ padding: '0 24px 24px' }}>
          {auth?.jwt && (
            <MainDrawer
              auth={auth}
              drawerIsVisible={drawerIsVisible}
              setDrawerIsVisible={setDrawerIsVisible}
            />
          )}
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
            }}
          >
            {children}
          </Content>
          <MainFooter />
        </Layout>
      </Layout>
    </Layout>
  );
}

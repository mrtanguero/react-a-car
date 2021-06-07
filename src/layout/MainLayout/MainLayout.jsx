import React, { useState } from 'react';
import { Layout } from 'antd';
import './MainLayout.css';

import MainHeader from '../MainHeader/MainHeader';
import MainSidebar from '../MainSidebar/MainSidebar';
import MainFooter from '../MainFooter/MainFooter';
import MainDrawer from '../MainDrawer/MainDrawer';

const { Content } = Layout;

export default function MainLayout({ children }) {
  const [drawerIsVisible, setDrawerIsVisible] = useState(false);

  return (
    <Layout>
      <MainHeader
        drawerIsVisible={drawerIsVisible}
        setDrawerIsVisible={setDrawerIsVisible}
      />
      <Layout>
        <MainSidebar />
        <Layout style={{ padding: '0 24px 24px' }}>
          <MainDrawer
            drawerIsVisible={drawerIsVisible}
            setDrawerIsVisible={setDrawerIsVisible}
          />
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

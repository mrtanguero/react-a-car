import React from "react";
import { Layout } from "antd";

import MainHeader from "../MainHeader/MainHeader";
import MainSidebar from "../MainSidebar/MainSidebar";
import MainFooter from "../MainFooter/MainFooter";

const { Content } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout>
      <MainHeader />
      <Layout>
        <MainSidebar />
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
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

import React from 'react';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer } = Layout;

export default function MainFooter() {
  const { t } = useTranslation();
  return <Footer style={{ textAlign: 'center' }}>{t('content.footer')}</Footer>;
}

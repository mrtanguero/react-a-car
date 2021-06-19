import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Page404() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography.Title level={4}>{t('content.page404')}</Typography.Title>
    </div>
  );
}

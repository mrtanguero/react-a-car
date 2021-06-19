import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

export default function Page403() {
  const { t } = useTranslation();
  const history = useHistory();
  if (localStorage.getItem('jwt')) {
    history.goBack();
  }

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
      <Typography.Title level={4}>{t('content.page403')}</Typography.Title>
    </div>
  );
}

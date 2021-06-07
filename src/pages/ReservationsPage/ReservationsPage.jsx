import { CalendarOutlined } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useHistory } from 'react-router';

export default function ReservationsPage() {
  const history = useHistory();
  const { t } = useTranslation();

  const handleClickNewReservation = () => {
    history.push('/reservations/create');
  };

  return (
    <>
      <PageHeader
        title={t('navigation.reservations')}
        extra={
          <Button onClick={handleClickNewReservation}>
            <CalendarOutlined />
            {t('buttons.newReservation')}
          </Button>
        }
      />
    </>
  );
}

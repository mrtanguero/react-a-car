import { CalendarOutlined } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';
import React from 'react';
import { useHistory } from 'react-router';

export default function ReservationsPage() {
  const history = useHistory();

  const handleClickNewReservation = () => {
    history.push('/reservations/create');
  };

  return (
    <>
      <PageHeader
        title="Rezervacije"
        extra={
          <Button onClick={handleClickNewReservation}>
            <CalendarOutlined />
            Dodaj rezervaciju
          </Button>
        }
      />
    </>
  );
}

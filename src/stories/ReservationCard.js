import React from 'react';
import { Card, Descriptions } from 'antd';
import PropTypes from 'prop-types';

export default function ReservationCard({ reservation }) {
  const handleCardClick = () => {};

  return (
    <Card
      style={{ width: 400 }}
      hoverable
      onClick={() => handleCardClick(reservation.id)}
    >
      <Descriptions
        title={reservation.vehicle.plate_no}
        column={1}
        bordered
        labelStyle={{ width: '20ch' }}
        contentStyle={{ width: '20ch' }}
        size="small"
      >
        <Descriptions.Item label="From">
          {reservation.from_date}
        </Descriptions.Item>
        <Descriptions.Item label="To">{reservation.to_date}</Descriptions.Item>
        <Descriptions.Item label="Rent location">
          {reservation.rent_location.name}
        </Descriptions.Item>
        <Descriptions.Item label="Return location">
          {reservation.return_location.name}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

ReservationCard.propTypes = {
  reservation: PropTypes.object,
};

import { Card, Descriptions } from 'antd';
import React from 'react';
import { useContext } from 'react';
import modalContext from '../../context/modalContext';
import ReservationForm from '../ReservationForm/ReservationForm';

export default function ReservationCard({ reservation }) {
  const modalCtx = useContext(modalContext);

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleCardClick = (reservationId) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Showing data for reservation ${reservationId}`,
      children: (
        <ReservationForm
          reservationId={reservationId}
          closeModal={handleCancelModal}
          disabled={true}
          hideClient={true}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  return (
    <Card hoverable onClick={() => handleCardClick(reservation.id)}>
      <Descriptions
        title={reservation.vehicle.plate_no}
        column={1}
        bordered
        labelStyle={{ width: '20ch' }}
        contentStyle={{ width: '20ch' }}
        size="small"
      >
        <Descriptions.Item label="Od">
          {reservation.from_date}
        </Descriptions.Item>
        <Descriptions.Item label="Do">{reservation.to_date}</Descriptions.Item>
        <Descriptions.Item label="Lok. preuzimanja">
          {reservation.rent_location.name}
        </Descriptions.Item>
        <Descriptions.Item label="Lok. vraćanja">
          {reservation.return_location.name}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

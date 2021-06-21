import React, { useContext } from 'react';
import { Card, Descriptions } from 'antd';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import modalContext from '../../context/modalContext';
import ReservationForm from '../ReservationForm/ReservationForm';

export default function ReservationCard({ reservation }) {
  const modalCtx = useContext(modalContext);
  const { t, i18n } = useTranslation();

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleCardClick = (reservationId) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.showReservation', { reservationId }),
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
    <Card
      hoverable
      bordered={false}
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
        <Descriptions.Item label={t('tableHeaders.from')}>
          {moment(reservation.from_date).format(
            i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t('tableHeaders.to')}>
          {moment(reservation.to_date).format(
            i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
          )}
        </Descriptions.Item>
        <Descriptions.Item label={t('tableHeaders.rentLocation')}>
          {reservation.rent_location.name}
        </Descriptions.Item>
        <Descriptions.Item label={t('tableHeaders.returnLocation')}>
          {reservation.return_location.name}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

ReservationCard.propTypes = {
  reservation: PropTypes.object,
};

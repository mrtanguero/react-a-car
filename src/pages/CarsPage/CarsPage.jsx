import React, { useContext } from 'react';
import { Button, Card, PageHeader } from 'antd';
import { useTranslation } from 'react-i18next';
import { CarOutlined } from '@ant-design/icons';
import modalContext from '../../context/modalContext';
import NewCarContainer from '../../components/NewCarContainer/NewCarContainer.jsx';

// const columns = [
//   {
//     title: 'Licence plate',
//     dataIndex: 'plate_no',
//     key: 'plates',
//   },
//   {
//     title: 'Year',
//     dataIndex: 'production_year',
//     key: 'year',
//   },
//   {
//     title: 'Seats',
//     dataIndex: 'no_of_seats',
//     key: 'seats',
//   },
//   {
//     title: 'Price per day',
//     dataIndex: 'price_per_day',
//     key: 'price',
//   },
// ];

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);
  const { t } = useTranslation();

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClick = () => {
    modalCtx.setModalProps({
      title: t('modals.newCar'),
      children: <NewCarContainer />,
      visible: true,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.vehicles')}
        extra={
          <Button onClick={handleClick}>
            <CarOutlined />
            {t('buttons.newCar')}
          </Button>
        }
      />
      <Card>Ovdje sadržaj?</Card>
    </>
  );
}

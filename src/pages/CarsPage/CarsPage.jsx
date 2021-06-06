import React, { useContext } from 'react';
import { Button, PageHeader } from 'antd';
import { CarOutlined } from '@ant-design/icons';
import modalContext from '../../context/modalContext';
import NewCar from '../../components/NewCar/NewCar';

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClick = () => {
    modalCtx.setModalProps({
      title: 'Add new car',
      children: <NewCar />,
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
        title="Vozila"
        extra={
          <Button onClick={handleClick}>
            <CarOutlined />
            Dodaj vozilo
          </Button>
        }
      />
    </>
  );
}

import { Button, PageHeader } from 'antd';
import React, { useContext } from 'react';
import modalContext from '../../context/modalContext';
import { UserAddOutlined } from '@ant-design/icons';
import NewClientForm from '../../components/NewClientForm/NewClientForm';

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: 'Dodaj novog korisnika',
      children: <NewClientForm />,
      onOk: () => {},
      onCancel: handleCancelModal,
    });
  };

  return (
    <>
      <PageHeader
        ghost={true}
        title="Klijenti"
        extra={
          <Button onClick={handleClick}>
            <UserAddOutlined />
            Dodaj klijenta
          </Button>
        }
      />
    </>
  );
}

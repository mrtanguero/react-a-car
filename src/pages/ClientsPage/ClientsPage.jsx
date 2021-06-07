import { Button, PageHeader } from 'antd';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import { UserAddOutlined } from '@ant-design/icons';
import NewClientForm from '../../components/NewClientForm/NewClientForm';

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);
  const { t } = useTranslation();

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newClient'),
      children: <NewClientForm />,
      onOk: () => {},
      onCancel: handleCancelModal,
    });
  };

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.clients')}
        extra={
          <Button onClick={handleClick}>
            <UserAddOutlined />
            {t('buttons.newClient')}
          </Button>
        }
      />
    </>
  );
}

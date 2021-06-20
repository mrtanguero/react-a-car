import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  PageHeader,
  Space,
  Spin,
  Table,
  Modal,
  message,
  Input,
} from 'antd';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { deleteClient, getClients } from '../../services/clients';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import ClientForm from '../../components/ClientForm/ClientForm';

const { confirm } = Modal;
const { Search } = Input;

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteClient(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('clients');
      message.success(t('successMessages.deleted'));
    },
    onError: (error) => {
      if (error.response.data.message.split(':')[0] === 'SQLSTATE[23000]') {
        message.error(t('errorMessages.clientHasReservations'));
      } else {
        message.error(error.response.data.message);
      }
    },
  });

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['clients', { searchTerm }], getClients, {
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.data.current_page === lastPage.data.last_page;
      return isLastPage ? false : lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
  });

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleNewClientClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newClient'),
      children: <ClientForm onCancel={handleCancelModal} />,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleShowClient = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.showClient', { id }),
      children: (
        <ClientForm
          clientId={id}
          disabled={true}
          onCancel={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleEditClientClick = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.editClient', { id }),
      children: (
        <ClientForm
          clientId={id}
          disabled={false}
          onCancel={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const onSearch = (data) => {
    setSearchTerm(data);
  };

  if (error) console.log(error.response.data.message);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.clients')}
        extra={
          <>
            <Search
              placeholder={t('placeholders.search')}
              onSearch={onSearch}
              loading={isFetching}
            />
            <Button onClick={handleNewClientClick}>
              <UserAddOutlined />
              {t('buttons.newClient')}
            </Button>
          </>
        }
      />
      <Card>
        <Table
          loading={!response?.pages.length && isFetching}
          columns={[
            {
              title: t('tableHeaders.clientName'),
              dataIndex: 'name',
              key: 'name',
              width: 180,
            },
            {
              title: t('tableHeaders.idDocNum'),
              dataIndex: 'identification_document_no',
              key: 'document-id',
              width: 150,
              ellipsis: true,
            },
            {
              title: t('tableHeaders.phone'),
              dataIndex: 'phone_no',
              key: 'phone',
              width: 150,
            },
            {
              title: t('tableHeaders.email'),
              dataIndex: 'email',
              key: 'email',
              width: 200,
            },
            {
              title: t('tableHeaders.country'),
              dataIndex: ['country', 'name'],
              key: 'country',
              width: 150,
            },
            {
              title: t('tableHeaders.actions'),
              key: 'action',
              align: 'center',
              width: 100,
              fixed: 'right',
              render: (text, record) => (
                <Space size="small">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!record?.user?.id) {
                        message.error(
                          'Ovaj klijent je seedovan i nema odgovarajućeg usera'
                        );
                        return;
                      }
                      handleEditClientClick(record.user.id);
                    }}
                    icon={<EditOutlined />}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!record?.user?.id) {
                        message.error(
                          'Ovaj klijent je seedovan i nema odgovarajućeg usera'
                        );
                        return;
                      }
                      confirm({
                        title: t('modals.confirmClientDelete'),
                        icon: <ExclamationCircleOutlined />,
                        content: t('modals.actionPermanent'),
                        okType: 'danger',
                        onOk() {
                          return mutation.mutateAsync(
                            record.user && record.user.id
                          );
                        },
                        onCancel() {},
                      });
                    }}
                    icon={<DeleteOutlined />}
                    danger
                  />
                </Space>
              ),
            },
          ]}
          dataSource={
            [].concat.apply(
              [],
              response?.pages.map((page) => page.data.data)
            ) || []
          }
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ x: '100%', y: '60vh' }}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: () => {
                if (!record?.user?.id) {
                  message.error(
                    'Ovaj klijent je seedovan i nema odgovarajućeg usera'
                  );
                  return;
                }
                handleShowClient(record.user.id);
              },
              ref:
                index === currentTotalLength(response.pages) - 3
                  ? (node) => setIntersectionObserverTarget(node)
                  : null,
            };
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            textAlign: 'center',
          }}
        >
          {isFetchingNextPage && <Spin size="small" />}
        </div>
      </Card>
    </>
  );
}

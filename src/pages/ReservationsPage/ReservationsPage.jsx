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
} from 'antd';
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';
import modalContext from '../../context/modalContext';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import {
  deleteReservation,
  getReservations,
} from '../../services/reservations';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import ReservationForm from '../../components/ReservationForm/ReservationForm';
import { useHistory } from 'react-router-dom';

const { confirm } = Modal;

export default function ReservationsPage() {
  const modalCtx = useContext(modalContext);
  const history = useHistory();
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
      message.success('Deleted!');
    },
    onError: () => {
      message.error(error.response.data.message);
    },
  });

  const {
    data: response,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery('reservations', getReservations, {
    getNextPageParam: (lastPage) => {
      const isLastPage = lastPage.data.current_page === lastPage.data.last_page;
      return isLastPage ? false : lastPage.data.current_page + 1;
    },
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (
        error.response.data.message ===
          'Attempt to read property "role_id" on null' ||
        error.response.data.message === 'Unauthenticated.'
      ) {
        localStorage.clear();
        history.replace('/login');
      }
    },
  });

  useIntersectionObserver({
    target: intersectionObserverTarget,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
  });

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleNewReservationClick = () => {
    history.push('/reservations/create');
  };

  const handleShowReservation = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Showing data for reservation ${id}`,
      children: (
        <ReservationForm
          reservationId={id}
          closeModal={handleCancelModal}
          disabled={true}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleEditReservationClick = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Edit reservation ${id}`,
      children: (
        <ReservationForm reservationId={id} closeModal={handleCancelModal} />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  if (error) console.log(error.response);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.reservations')}
        extra={
          <Button onClick={handleNewReservationClick}>
            <CalendarOutlined />
            {t('buttons.newReservation')}
          </Button>
        }
      />
      <Card>
        <Table
          loading={!response?.pages.length && isFetching}
          columns={[
            {
              title: 'Klijent',
              dataIndex: ['client', 'name'],
              key: 'name',
              width: 180,
            },
            {
              title: 'Vozilo',
              dataIndex: ['vehicle', 'plate_no'],
              key: 'country',
              width: 120,
            },
            {
              title: 'Od',
              dataIndex: 'from_date',
              key: 'document-id',
              width: 100,
            },
            {
              title: 'Do',
              dataIndex: 'to_date',
              key: 'email',
              width: 100,
            },
            {
              title: 'Lokacija preuzimanja',
              dataIndex: ['rent_location', 'name'],
              key: 'phone',
              width: 150,
            },
            {
              title: 'Lokacija vraćanja',
              dataIndex: ['return_location', 'name'],
              key: 'phone',
              width: 150,
            },
            {
              title: 'Ukupna cijena',
              dataIndex: ['total_price'],
              key: 'price',
              width: 120,
              render: (_, record) => `${record.total_price}€`,
            },
            {
              title: 'Akcije',
              key: 'action',
              align: 'center',
              width: 100,
              fixed: 'right',
              render: (text, record) => (
                <Space size="small">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditReservationClick(record.id);
                    }}
                    icon={<EditOutlined />}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm({
                        title: 'Do you want to delete this reservation?',
                        icon: <ExclamationCircleOutlined />,
                        content: `This action is not reversible!`,
                        okType: 'danger',
                        onOk() {
                          return mutation.mutateAsync(record.id);
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
          scroll={{ x: '100%', y: '400px' }}
          size="small"
          onRow={(record, index) => {
            return {
              onClick: () => {
                handleShowReservation(record.id);
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

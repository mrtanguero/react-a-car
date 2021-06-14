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
  CarOutlined,
} from '@ant-design/icons';
import { deleteVehicle, getVehicles } from '../../services/cars';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import MultiStepForm from '../../components/MultiStepForm/MultiStepForm';

const { confirm } = Modal;

export default function CarsPage() {
  const modalCtx = useContext(modalContext);
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteVehicle(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      message.success('Deleted!');
    },
    onError: (error) => {
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
  } = useInfiniteQuery('vehicles', getVehicles, {
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

  const handleNewVehicleClick = () => {
    modalCtx.setModalProps({
      visible: true,
      title: t('modals.newCar'),
      children: <MultiStepForm closeModal={handleCancelModal} />,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleShowVehicle = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Showing data for vehicle ${id}`,
      children: (
        <MultiStepForm
          vehicleId={id}
          disabled={true}
          closeModal={handleCancelModal}
        />
      ),
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  const handleEditVehicleClick = (id) => {
    modalCtx.setModalProps({
      visible: true,
      title: `Edit vehicle ${id}`,
      children: (
        <MultiStepForm
          vehicleId={id}
          disabled={false}
          closeModal={handleCancelModal}
        />
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
        title={t('navigation.vehicles')}
        extra={
          <Button onClick={handleNewVehicleClick}>
            <CarOutlined />
            {t('buttons.newCar')}
          </Button>
        }
      />
      <Card>
        <Table
          loading={!response?.pages.length && isFetching}
          columns={[
            {
              title: 'Licence plate',
              dataIndex: 'plate_no',
              key: 'plates',
              width: 105,
            },
            {
              title: 'Year',
              dataIndex: 'production_year',
              key: 'year',
              width: 80,
            },
            {
              title: 'Type',
              dataIndex: ['car_type', 'name'],
              key: 'type',
              width: 120,
            },
            {
              title: 'Seats',
              dataIndex: 'no_of_seats',
              key: 'seats',
              width: 80,
            },
            {
              title: 'Price per day',
              dataIndex: 'price_per_day',
              key: 'price',
              width: 120,
            },
            {
              title: 'Notes',
              dataIndex: 'remarks',
              key: 'remarks',
              width: 200,
            },
            {
              title: 'Actions',
              key: 'action',
              align: 'center',
              width: 100,
              fixed: 'right',
              render: (text, record) => (
                <Space size="small">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditVehicleClick(record.id);
                    }}
                    icon={<EditOutlined />}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!record?.id) {
                        message.error(
                          'Ovaj klijent je seedovan i nema odgovarajućeg usera'
                        );
                        return;
                      }
                      confirm({
                        title: 'Do you want to delete this vehicle?',
                        icon: <ExclamationCircleOutlined />,
                        content: `This action is not revertable!`,
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
                handleShowVehicle(record.id);
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

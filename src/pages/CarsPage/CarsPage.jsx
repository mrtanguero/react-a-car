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
  CarOutlined,
} from '@ant-design/icons';
import { deleteVehicle, getVehicles } from '../../services/cars';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { currentTotalLength } from '../../helper/functions';
import MultiStepForm from '../../components/MultiStepForm/MultiStepForm';
// import Input from 'react-select/src/components/Input';

const { confirm } = Modal;
const { Search } = Input;

export default function CarsPage() {
  const modalCtx = useContext(modalContext);
  const [intersectionObserverTarget, setIntersectionObserverTarget] = useState(
    null
  );
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const mutation = useMutation((id) => deleteVehicle(id), {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      message.success(t('successMessages.deleted'));
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
  } = useInfiniteQuery(['vehicles', { searchTerm }], getVehicles, {
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
      title: t('modals.showVehicle', { id }),
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
      title: t('modals.editVehicle', { id }),
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

  const onSearch = (data) => {
    setSearchTerm(data);
  };

  if (error) console.log(error.response);

  return (
    <>
      <PageHeader
        ghost={true}
        title={t('navigation.vehicles')}
        extra={
          <>
            <Search
              placeholder={t('placeholders.search')}
              onSearch={onSearch}
              loading={isFetching}
            />
            <Button onClick={handleNewVehicleClick}>
              <CarOutlined />
              {t('buttons.newCar')}
            </Button>
          </>
        }
      />
      <Card>
        <Table
          loading={!response?.pages.length && isFetching}
          columns={[
            {
              title: t('tableHeaders.plateNo'),
              dataIndex: 'plate_no',
              key: 'plates',
              width: 105,
            },
            {
              title: t('tableHeaders.year'),
              dataIndex: 'production_year',
              key: 'year',
              width: 80,
            },
            {
              title: t('tableHeaders.carType'),
              dataIndex: ['car_type', 'name'],
              key: 'type',
              width: 120,
            },
            {
              title: t('tableHeaders.seatsNum'),
              dataIndex: 'no_of_seats',
              key: 'seats',
              width: 80,
            },
            {
              title: t('tableHeaders.pricePerDay'),
              dataIndex: 'price_per_day',
              key: 'price',
              width: 120,
            },
            {
              title: t('tableHeaders.remarks'),
              dataIndex: 'remarks',
              key: 'remarks',
              width: 200,
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
                      handleEditVehicleClick(record.id);
                    }}
                    icon={<EditOutlined />}
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirm({
                        title: t('modals.confirmVehicleDelete'),
                        icon: <ExclamationCircleOutlined />,
                        content: t('modals.actionPermanent'),
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
          scroll={{ x: '100%', y: '60vh' }}
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

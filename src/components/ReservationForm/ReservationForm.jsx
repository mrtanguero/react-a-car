import './ReservationForm.css';
import {
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  message,
  Select,
  Space,
  Spin,
  TreeSelect,
} from 'antd';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { renderEquipmentTreeOptions } from '../../helper/functions';
import {
  createReservation,
  getEquipment,
  getLocations,
  getReservation,
  updateReservation,
} from '../../services/reservations';
import moment from 'moment';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getClients } from '../../services/clients';
import MyAsyncSelect from '../MyAsyncSelect/MyAsyncSelect';
import { useTranslation } from 'react-i18next';

export default function ReservationForm({
  reservationId,
  vehicleData,
  selectedDates,
  closeModal,
  disabled,
  hideClient,
}) {
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const { t, i18n } = useTranslation();
  const history = useHistory();

  const queryClient = useQueryClient();

  const {
    control,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const watchDates = watch(['from_date', 'to_date']);

  const { data: locationsResponse } = useQuery('locations', getLocations);

  useQuery('equipment', getEquipment, {
    onSuccess: ({ data: { data } }) => {
      setAvailableEquipment(data);
    },
    onError: (error) => {
      if (
        error?.response?.data?.message ===
        'Attempt to read property "role_id" on null'
      ) {
        localStorage.removeItem('jwt');
        history.replace('/login');
      }
    },
  });

  const { data: reservationResponse, isLoading } = useQuery(
    ['getReservation', reservationId],
    () => getReservation(reservationId),
    {
      enabled: !!reservationId,
      onError: (error) => {
        if (
          error?.response?.data?.message ===
          'Attempt to read property "role_id" on null'
        ) {
          localStorage.removeItem('jwt');
          history.replace('/login');
        }
      },
    }
  );

  useEffect(() => {
    if (reservationId && setAvailableEquipment.length !== 0) {
      reset({
        from_date: moment(reservationResponse?.data.from_date),
        to_date: moment(reservationResponse?.data.to_date),
        rent_location_id: reservationResponse?.data.rent_location_id,
        return_location_id: reservationResponse?.data.return_location_id,
      });
      setEquipmentData(() => []);
      reservationResponse?.data.equipment.forEach((equipment) => {
        setEquipmentData((old) => [
          ...old,
          `${equipment.id}-${equipment.pivot.quantity}`,
        ]);
      });
    }
  }, [reservationId, reservationResponse, reset]);

  useEffect(() => {
    if (vehicleData?.id) {
      reset({
        from_date: moment(selectedDates[0]),
        to_date: moment(selectedDates[1]),
        vehicle_id: vehicleData.id,
      });
    }
  }, [vehicleData, selectedDates, reset]);

  const createMutation = useMutation('createReservation', createReservation, {
    onSuccess: () => {
      queryClient.invalidateQueries('reservations');
      closeModal();
      reset();
      message.success(t('successMessages.created'));
    },
    onError: (error) => {
      console.log(error.response.data.message);
    },
  });

  const updateMutation = useMutation(
    ['updateReservation', reservationId],
    (data) => updateReservation(data, reservationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reservations');
        closeModal();
        reset();
        message.success(t('successMessages.updated'));
      },
      onError: (error) => {
        console.log(error.response.data.message);
        if (
          error?.response?.data?.message ===
          'Attempt to read property "role_id" on null'
        ) {
          localStorage.removeItem('jwt');
          history.replace('/login');
        }
      },
    }
  );

  const handleTreeSelectChange = (data) => {
    const noDuplicates = data.filter(
      (entry, i, arr) =>
        entry.split('-')[0] !== arr[arr.length - 1].split('-')[0] ||
        i === arr.length - 1
    );
    setEquipmentData(noDuplicates);
  };

  const onSubmit = (data) => {
    if (reservationId) {
      updateMutation.mutate({
        ...data,
        client_id: reservationResponse?.data.client_id,
        vehicle_id: reservationResponse?.data.vehicle_id,
        from_date: data.from_date.format('YYYY-MM-DD'),
        to_date: data.to_date.format('YYYY-MM-DD'),
        equipment: equipmentData.map((entry) => {
          return {
            equipment_id: entry.split('-')[0],
            quantity: entry.split('-')[1],
          };
        }),
      });
    } else {
      createMutation.mutate({
        ...data,
        client: undefined,
        client_id: data.client.value,
        from_date: data.from_date.format('YYYY-MM-DD'),
        to_date: data.to_date.format('YYYY-MM-DD'),
        equipment: equipmentData.map((entry) => {
          return {
            equipment_id: entry.split('-')[0],
            quantity: entry.split('-')[1],
          };
        }),
      });
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {reservationId && !hideClient && (
          <div className="client-info">
            <Descriptions
              title={t('formLabels.client')}
              bordered
              size="small"
              column={1}
              labelStyle={{ width: '20ch' }}
              contentStyle={{ color: 'grey' }}
            >
              <Descriptions.Item label={t('formLabels.name')}>
                {reservationResponse?.data.client.name}
              </Descriptions.Item>
              <Descriptions.Item label={t('formLabels.email')}>
                {reservationResponse?.data.client.email}
              </Descriptions.Item>
              <Descriptions.Item label={t('formLabels.phoneShort')}>
                {reservationResponse?.data.client.phone_no}
              </Descriptions.Item>
              <Descriptions.Item label={t('formLabels.IdDocShort')}>
                {reservationResponse?.data.client.identification_document_no}
              </Descriptions.Item>
              <Descriptions.Item label={t('formLabels.country')}>
                {reservationResponse?.data.client.country.name}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <div className="vehicle-info">
          <Descriptions
            title={t('formLabels.vehicle')}
            size="small"
            bordered
            column={1}
            labelStyle={{ width: '20ch' }}
            contentStyle={{ color: 'grey' }}
          >
            <Descriptions.Item label={t('formLabels.plateNo')}>
              {vehicleData?.plate_no ||
                reservationResponse?.data.vehicle.plate_no}
            </Descriptions.Item>
            <Descriptions.Item label={t('formLabels.year')}>
              {vehicleData?.production_year ||
                reservationResponse?.data.vehicle.production_year}
            </Descriptions.Item>
            <Descriptions.Item label={t('formLabels.carType')}>
              {vehicleData?.car_type.name ||
                reservationResponse?.data.vehicle.car_type.name}
            </Descriptions.Item>
            <Descriptions.Item label={t('formLabels.seatsNo')}>
              {vehicleData?.no_of_seats ||
                reservationResponse?.data.vehicle.no_of_seats}
            </Descriptions.Item>
            <Descriptions.Item label={t('formLabels.pricePerDay')}>
              {vehicleData?.price_per_day ||
                reservationResponse?.data.vehicle.price_per_day}
              €
            </Descriptions.Item>
          </Descriptions>
        </div>

        {disabled && (
          <>
            <div className="dates-info">
              <Descriptions
                title={t('formLabels.dates')}
                size="small"
                column={1}
                bordered
                labelStyle={{ width: '20ch' }}
                contentStyle={{ color: 'grey' }}
              >
                <Descriptions.Item label={t('formLabels.from')}>
                  {reservationResponse?.data.from_date}
                </Descriptions.Item>
                <Descriptions.Item label={t('formLabels.to')}>
                  {reservationResponse?.data.to_date}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="locations-info">
              <Descriptions
                title={t('formLabels.locations')}
                size="small"
                bordered
                column={1}
                labelStyle={{ width: '20ch' }}
                contentStyle={{
                  color: 'grey',
                  paddingRight: 16,
                }}
              >
                <Descriptions.Item label={t('formLabels.pickup')}>
                  {reservationResponse?.data.rent_location.name}
                </Descriptions.Item>
                <Descriptions.Item label={t('formLabels.return')}>
                  {reservationResponse?.data.return_location.name}
                </Descriptions.Item>
              </Descriptions>
            </div>
            {reservationResponse?.data.equipment.length > 0 && (
              <Descriptions
                title={t('formLabels.equipment')}
                size="small"
                bordered
                column={1}
                labelStyle={{ width: '20ch' }}
                contentStyle={{
                  color: 'grey',
                  paddingRight: 16,
                }}
              >
                {reservationResponse?.data.equipment.map((equipment) => {
                  return (
                    <Descriptions.Item
                      key={equipment.id}
                      label={`${equipment.name}${
                        equipment.pivot.quantity > 1 ? 's' : ''
                      }`}
                    >
                      {equipment.pivot.quantity}
                    </Descriptions.Item>
                  );
                })}
              </Descriptions>
            )}
            <Descriptions
              column={1}
              bordered
              size="small"
              labelStyle={{
                width: '50%',
                textTransform: 'uppercase',
                textAlign: 'center',
              }}
              contentStyle={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'grey',
              }}
            >
              <Descriptions.Item label={t('formLabels.totalPrice')}>
                {reservationResponse?.data?.total_price}€
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Space>

      {!disabled && (
        <>
          <Divider />
          <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
            {!reservationId && (
              <Form.Item label={t('formLabels.client')}>
                <Controller
                  name="client"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('errorMessages.requiredField'),
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <MyAsyncSelect
                        {...field}
                        placeholder={t('placeholders.client')}
                        queryFn={getClients}
                        labelName="name"
                        valueName="id"
                      />
                    );
                  }}
                />
              </Form.Item>
            )}
            <div className="reservation-form-container reservation-dates">
              <Form.Item
                style={{ flex: 1, width: '100%' }}
                label={t('formLabels.from')}
                help={errors['from_date'] && errors['from_date'].message}
                validateStatus={errors['from_date'] && 'error'}
                hasFeedback
              >
                <Controller
                  name="from_date"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('errorMessages.requiredField'),
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      style={{ width: '100%' }}
                      {...field}
                      placeholder={t('placeholders.from')}
                      format={
                        i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                      }
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                style={{ flex: 1 }}
                label={t('formLabels.to')}
                help={errors['to_date'] && errors['to_date'].message}
                validateStatus={errors['to_date'] && 'error'}
                hasFeedback
              >
                <Controller
                  name="to_date"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('errorMessages.requiredField'),
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      style={{ width: '100%' }}
                      {...field}
                      placeholder={t('placeholders.to')}
                      format={
                        i18n.language === 'me' ? 'DD.MM.YYYY.' : 'YYYY-MM-DD'
                      }
                    />
                  )}
                />
              </Form.Item>
            </div>
            <div className="reservation-form-container location-dates">
              <Form.Item
                label={t('formLabels.pickupLocation')}
                help={
                  errors['rent_location_id'] &&
                  errors['rent_location_id'].message
                }
                validateStatus={errors['rent_location_id'] && 'error'}
                hasFeedback
                style={{ flex: 1 }}
              >
                <Controller
                  name="rent_location_id"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('errorMessages.requiredField'),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch={true}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={t('placeholders.rentLocation')}
                      options={
                        locationsResponse?.data.map((carType) => {
                          return { label: carType.name, value: carType.id };
                        }) || []
                      }
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                label={t('formLabels.returnLocation')}
                help={
                  errors['return_location_id'] &&
                  errors['return_location_id'].message
                }
                validateStatus={errors['return_location_id'] && 'error'}
                style={{ flex: 1 }}
                hasFeedback
              >
                <Controller
                  name="return_location_id"
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: t('errorMessages.requiredField'),
                    },
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      showSearch={true}
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        option.label
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder={t('placeholders.returnLocation')}
                      options={
                        locationsResponse?.data.map((carType) => {
                          return { label: carType.name, value: carType.id };
                        }) || []
                      }
                    />
                  )}
                />
              </Form.Item>
            </div>
            <Form.Item label={t('formLabels.equipment')} hasFeedback>
              <TreeSelect
                name="equipment"
                treeData={renderEquipmentTreeOptions(availableEquipment)}
                onChange={handleTreeSelectChange}
                value={equipmentData}
                placeholder={t('placeholders.equipment')}
                multiple
              />
            </Form.Item>
            {!disabled && (
              <Descriptions
                column={1}
                bordered
                size="small"
                labelStyle={{
                  width: '50%',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                }}
                contentStyle={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'grey',
                }}
              >
                <Descriptions.Item label={t('formLabels.totalPrice')}>
                  {watchDates[0] && watchDates[1]
                    ? (Math.ceil(
                        Math.abs(
                          (new Date(watchDates[1].format('YYYY-MM-DD')) -
                            new Date(watchDates[0].format('YYYY-MM-DD'))) /
                            (1000 * 60 * 60 * 24)
                        )
                      ) +
                        1) *
                      +(
                        vehicleData?.price_per_day ||
                        reservationResponse?.data.vehicle.price_per_day
                      )
                    : null}
                  €
                </Descriptions.Item>
              </Descriptions>
            )}
            <div className="form-actions">
              <Button
                htmlType="submit"
                type="primary"
                loading={updateMutation.isLoading || createMutation.isLoading}
              >
                {t('buttons.save')}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Spin>
  );
}

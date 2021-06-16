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
  getEquipment,
  getLocations,
  getReservation,
  updateReservation,
} from '../../services/reservations';
import moment from 'moment';

import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MyAsyncSelect from '../../components/MyAsyncSelect/MyAsyncSelect';
import { getClients } from '../../services/clients';

export default function ReservationForm({
  reservationId,
  closeModal,
  disabled,
}) {
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);
  const history = useHistory();

  const queryClient = useQueryClient();

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm();
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
  }, [reservationResponse, reset]);

  const mutation = useMutation(
    ['updateReservation', reservationId],
    (data) => updateReservation(data, reservationId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('reservations');
        closeModal();
        reset();
        message.success('Updated!');
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
    console.log(data);

    mutation.mutate({
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
  };

  return (
    <Spin spinning={isLoading}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {reservationId && (
          <div className="client-info">
            <Descriptions
              title="Klijent"
              bordered
              size="small"
              column={1}
              labelStyle={{ width: '20ch' }}
              contentStyle={{ color: 'grey' }}
            >
              <Descriptions.Item label="Ime">
                {reservationResponse?.data.client.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {reservationResponse?.data.client.email}
              </Descriptions.Item>
              <Descriptions.Item label="Telefon">
                {reservationResponse?.data.client.phone_no}
              </Descriptions.Item>
              <Descriptions.Item label="Broj lične/pasoša">
                {reservationResponse?.data.client.identification_document_no}
              </Descriptions.Item>
              <Descriptions.Item label="Država">
                {reservationResponse?.data.client.country.name}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
        <div className="vehicle-info">
          <Descriptions
            title="Vehicle"
            size="small"
            bordered
            column={1}
            labelStyle={{ width: '20ch' }}
            contentStyle={{ color: 'grey' }}
          >
            <Descriptions.Item label="Broj registracije">
              {reservationResponse?.data.vehicle.plate_no}
            </Descriptions.Item>
            <Descriptions.Item label="Godina proizvodnje">
              {reservationResponse?.data.vehicle.production_year}
            </Descriptions.Item>
            <Descriptions.Item label="Tip vozila">
              {reservationResponse?.data.vehicle.car_type.name}
            </Descriptions.Item>
            <Descriptions.Item label="Broj sjedišta">
              {reservationResponse?.data.vehicle.no_of_seats}
            </Descriptions.Item>
            <Descriptions.Item label="Cijena po danu">
              {reservationResponse?.data.vehicle.price_per_day}€
            </Descriptions.Item>
          </Descriptions>
        </div>

        {disabled && (
          <>
            <div className="dates-info">
              <Descriptions
                title="Datumi"
                size="small"
                column={1}
                bordered
                labelStyle={{ width: '20ch' }}
                contentStyle={{ color: 'grey' }}
              >
                <Descriptions.Item label="Od">
                  {reservationResponse?.data.from_date}
                </Descriptions.Item>
                <Descriptions.Item label="Do">
                  {reservationResponse?.data.to_date}
                </Descriptions.Item>
              </Descriptions>
            </div>
            <div className="locations-info">
              <Descriptions
                title="Lokacije"
                size="small"
                bordered
                column={1}
                labelStyle={{ width: '20ch' }}
                contentStyle={{
                  color: 'grey',
                  paddingRight: 16,
                }}
              >
                <Descriptions.Item label="Preuzimanje">
                  {reservationResponse?.data.rent_location.name}
                </Descriptions.Item>
                <Descriptions.Item label="Vraćanje">
                  {reservationResponse?.data.return_location.name}
                </Descriptions.Item>
              </Descriptions>
            </div>
            {reservationResponse?.data.equipment.length > 0 && (
              <Descriptions
                title="Dodatna oprema"
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
          </>
        )}
      </Space>

      {!disabled && (
        <>
          <Divider />
          <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
            {!reservationId && (
              <Form.Item label="Klijent">
                <MyAsyncSelect
                  queryFn={getClients}
                  valueName="id"
                  labelName="name"
                />
              </Form.Item>
            )}
            <div style={{ display: 'flex', gap: 24 }}>
              <Form.Item
                style={{ flex: 1, width: '100%' }}
                label="Od"
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
                      message: 'Obavezno polje.',
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      style={{ width: '100%' }}
                      {...field}
                      placeholder="Datum od"
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                style={{ flex: 1 }}
                label="Do"
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
                      message: 'Obavezno polje.',
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      style={{ width: '100%' }}
                      {...field}
                      placeholder="Datum do"
                    />
                  )}
                />
              </Form.Item>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              <Form.Item
                label="Lokacija preuzimanja"
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
                      message: 'Obavezno polje',
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
                      placeholder="Odaberite klijenta"
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
                label="Lokacija vraćanja"
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
                      message: 'Klijent je obavezan za rezervaciju',
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
                      placeholder="Odaberite klijenta"
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
            <Form.Item label="Dodatna oprema" hasFeedback>
              <TreeSelect
                name="equipment"
                treeData={renderEquipmentTreeOptions(availableEquipment)}
                onChange={handleTreeSelectChange}
                value={equipmentData}
                placeholder="Unesite dodatnu opremu"
                multiple
              />
            </Form.Item>
            <div className="form-actions">
              <Button
                htmlType="submit"
                type="primary"
                loading={mutation.isLoading}
              >
                Sačuvaj
              </Button>
            </div>
          </Form>
        </>
      )}
    </Spin>
  );
}

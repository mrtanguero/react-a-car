import { Button, DatePicker, Form, message, Select, TreeSelect } from 'antd';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { renderEquipmentTreeOptions } from '../../helper/functions';
import { getVehicles } from '../../services/cars';
import { getClients } from '../../services/clients';
import {
  getEquipment,
  getLocations,
  getReservation,
  updateReservation,
} from '../../services/reservations';
import moment from 'moment';

import MyAsyncSelect from '../MyAsyncSelect/MyAsyncSelect';
import { useEffect } from 'react';

export default function ReservationForm({ reservationId, closeModal }) {
  const [client, setClient] = useState(null);
  const [clientInput, setClientInput] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [vehicleInput, setVehicleInput] = useState('');
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [equipmentData, setEquipmentData] = useState([]);

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
  });

  const { data: reservationResponse } = useQuery(
    ['getReservation', reservationId],
    () => getReservation(reservationId),
    {
      enabled: !!reservationId,
      onSuccess: ({ data }) => {
        console.log(data);
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
    setClientInput(reservationResponse?.data.client.name);
    setVehicleInput(reservationResponse?.data.vehicle.plate_no);
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
      client_id: client.value,
      vehicle_id: vehicle.value,
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
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item label="Vozilo" name="car_id">
        <MyAsyncSelect
          queryFn={getClients}
          inputValue={clientInput}
          onInputChange={setClientInput}
          value={client}
          onChange={setClient}
          valueName="id"
          labelName="name"
          placeholder={reservationResponse?.data.client.name}
        />
      </Form.Item>
      <Form.Item label="Vozilo" name="client_id">
        <MyAsyncSelect
          queryFn={getVehicles}
          value={vehicle}
          inputValue={vehicleInput}
          onInputChange={setVehicleInput}
          onChange={setVehicle}
          valueName="id"
          labelName="plate_no"
          placeholder={reservationResponse?.data.vehicle.plate_no}
        />
      </Form.Item>
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
      <Form.Item
        label="Lokacija preuzimanja"
        help={errors['rent_location_id'] && errors['rent_location_id'].message}
        validateStatus={errors['rent_location_id'] && 'error'}
        hasFeedback
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
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          errors['return_location_id'] && errors['return_location_id'].message
        }
        validateStatus={errors['return_location_id'] && 'error'}
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
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
      <Form.Item label="Dodatna oprema" hasFeedback>
        <TreeSelect
          name="equipment"
          treeData={renderEquipmentTreeOptions(availableEquipment)}
          onChange={handleTreeSelectChange}
          value={equipmentData}
          multiple
        />
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={mutation.isLoading}>
        Sačuvaj
      </Button>
    </Form>
  );
}

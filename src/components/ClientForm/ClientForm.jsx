import { Form, Input, Button, Select, message, Spin } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCountries } from '../../services/countries';
import { createClient, getClient, updateClient } from '../../services/clients';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function ClientForm({ clientId, disabled, onCancel }) {
  const [clientQueryEnabled, setClientQueryEnabled] = useState(false);
  const queryClient = useQueryClient();

  const { data: countriesResponse } = useQuery('getCountries', getCountries);
  const { data: clientsResponse, isLoading } = useQuery(
    ['getClient', clientId],
    () => getClient(clientId),
    {
      enabled: clientQueryEnabled,
      // TODO: neki error handling
      onError: (error) => console.log(error.response),
    }
  );

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: clientsResponse?.data.client,
  });

  useEffect(() => {
    reset(clientsResponse?.data.client);
  }, [clientsResponse?.data.client, reset]);

  useEffect(() => {
    if (clientId) {
      setClientQueryEnabled(true);
    }
    return () => {
      reset({});
    };
  }, [clientId, reset]);

  const createMutation = useMutation(
    'createMutation',
    (data) => createClient(data),
    {
      onSuccess: () => {
        message.success('Created!');
        queryClient.invalidateQueries('clients');
        onCancel();
      },
      onError: (error) => {
        console.log(error.response);
        if (
          error.response.data.message ===
          'The identification document no has already been taken.'
        ) {
          setError('identification_document_no', {
            type: 'manual',
            message: 'Ovaj broj lične karte ili pasoša već postoji u bazi',
          });
        }

        if (
          error.response.data.message === 'The email has already been taken.'
        ) {
          setError('identification_document_no', {
            type: 'manual',
            message: 'Ovaj email već postoji u bazi.',
          });
        }
      },
    }
  );

  const updateMutation = useMutation(
    ['updateMutation', clientId],
    (data) => updateClient(data, clientId),
    {
      onSuccess: () => {
        message.success('Updated!');
        queryClient.invalidateQueries('clients');
        onCancel();
      },
      onError: (error) => {
        console.log(error.response);
      },
    }
  );

  const onSubmit = (data) => {
    if (!clientId) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({
        name: data.name,
        phone_no: data.phone_no,
        email: data.email,
        identification_document_no: data.identification_document_no,
        country_id: data.country_id,
      });
    }
  };

  return (
    <Spin spinning={isLoading}>
      <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
        <Form.Item
          label="Ime i prezime"
          help={errors['name'] && errors['name'].message}
          validateStatus={errors['name'] && 'error'}
          hasFeedback
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Ime i prezime su obavezni',
              },
              minLength: {
                value: 5,
                message: 'Minimalno 5 karaktera',
              },
              maxLength: {
                value: 30,
                message: 'Maksimalno 30 karaktera',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder="Unesite ime i prezime..."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          help={errors['email'] && errors['email'].message}
          validateStatus={errors['email'] && 'error'}
          hasFeedback
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Email je obavezan',
              },
              pattern: {
                value: emailRegEx,
                message: 'Morate unijeti validnu email adresu',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder="Unesite email adresu..."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Broj telefona"
          help={errors['phone_no'] && errors['phone_no'].message}
          validateStatus={errors['phone_no'] && 'error'}
          hasFeedback
        >
          <Controller
            name="phone_no"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Broj telefona je obavezan',
              },
              pattern: {
                value: /^[0-9]+$/i,
                message: 'Unesite samo cifre, bez dodatnih simbola',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder="Unesite broj telefona..."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Broj pasoša / lične karte"
          help={
            errors['identification_document_no'] &&
            errors['identification_document_no'].message
          }
          validateStatus={errors['identification_document_no'] && 'error'}
          hasFeedback
        >
          <Controller
            name="identification_document_no"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Broj pasoša / lične karte je obavezan',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder="Unesite broj pasoša / lične karte..."
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Država"
          help={errors['country_id'] && errors['country_id'].message}
          validateStatus={errors['country_id'] && 'error'}
          hasFeedback
        >
          <Controller
            name="country_id"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Obavezno je odabrati državu',
              },
            }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                disabled={disabled}
                placeholder="Odaberite državu"
                optionFilterProp="label"
                options={
                  countriesResponse?.data.map((country) => {
                    return { label: country.name, value: country.id };
                  }) || []
                }
                filterOption={(input, option) => {
                  return (
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  );
                }}
              ></Select>
            )}
          />
        </Form.Item>

        <div className="form-actions">
          <Button
            type="primary"
            disabled={disabled}
            loading={createMutation.isLoading || updateMutation.isLoading}
            htmlType="submit"
          >
            Submit
          </Button>
        </div>
      </Form>
    </Spin>
  );
}

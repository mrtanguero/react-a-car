import { Form, Input, Button, Select, message, Spin } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getCountries } from '../../services/countries';
import { createClient, getClient, updateClient } from '../../services/clients';
import { useTranslation } from 'react-i18next';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function ClientForm({ clientId, disabled, onCancel }) {
  const [clientQueryEnabled, setClientQueryEnabled] = useState(false);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: countriesResponse } = useQuery('getCountries', getCountries);
  const { data: clientsResponse, isLoading } = useQuery(
    ['getClient', clientId],
    () => getClient(clientId),
    {
      enabled: clientQueryEnabled,
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
        message.success(t('successMessages.created'));
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
            message: t('errorMessages.takenIdNo'),
          });
        }

        if (
          error.response.data.message === 'The email has already been taken.'
        ) {
          setError('identification_document_no', {
            type: 'manual',
            message: t('takenEmail'),
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
        message.success(t('successMessages.updated'));
        queryClient.invalidateQueries('clients');
        onCancel();
      },
      onError: (error) => {
        console.log(error.response.data.message);
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
          label={t('formLabels.fullName')}
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
                message: t('errorMessages.requiredField'),
              },
              minLength: {
                value: 5,
                message: t('errorMessages.minCharsGeneric', { num: 5 }),
              },
              maxLength: {
                value: 30,
                message: t('errorMessages.maxCharsGeneric', { num: 30 }),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder={t('placeholders.clientName')}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('formLabels.email')}
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
                message: t('errorMessages.requiredField'),
              },
              pattern: {
                value: emailRegEx,
                message: t('errorMessages.emailInvalid'),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder={t('placeholders.clientEmail')}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('formLabels.phone')}
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
                message: t('errorMessages.requiredField'),
              },
              pattern: {
                value: /^[0-9]+$/i,
                message: t('errorMessages.onlyNumbers'),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder={t('placeholders.clientPhone')}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('formLabels.IdDoc')}
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
                message: t('errorMessages.requiredField'),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                disabled={disabled}
                placeholder={t('placeholders.clientIdNo')}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t('formLabels.country')}
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
                message: t('errorMessages.requiredField'),
              },
            }}
            render={({ field }) => (
              <Select
                {...field}
                showSearch
                disabled={disabled}
                placeholder={t('placeholders.clientState')}
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
            {t('buttons.save')}
          </Button>
        </div>
      </Form>
    </Spin>
  );
}

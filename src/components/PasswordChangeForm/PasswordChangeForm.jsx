import { Form, Input, message, Button } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { changePassword } from '../../services/account';

export default function PasswordChangeForm({ closeModal }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {},
  });

  const mutation = useMutation(
    'changePassword',
    (data) => changePassword(data),
    {
      onSuccess: () => {
        closeModal();
        message.success('Lozinka je uspješno promijenjena');
      },
      onError: (error) => {
        console.log(error.response.data.message);
      },
    }
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        label="Stara lozinka"
        help={errors.old_password && errors.old_password.message}
        validateStatus={errors.old_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder="Unesite svoju staru lozinku..."
          {...register('old_password', {
            required: {
              value: true,
              message: 'Obavezno polje!',
            },
          })}
        />
      </Form.Item>
      <Form.Item
        label="Nova lozinka"
        help={errors.new_password && errors.new_password.message}
        validateStatus={errors.new_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder="Unesite novu lozinku..."
          {...register('new_password', {
            required: {
              value: true,
              message: 'Obavezno polje!',
            },
          })}
        />
      </Form.Item>
      <Form.Item
        label="Potvrdite novu lozinku"
        help={errors.confirm_password && errors.confirm_password.message}
        validateStatus={errors.confirm_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder="Ponovo unesite novu lozinku..."
          {...register('confirm_password', {
            required: {
              value: true,
              message: 'Obavezno polje!',
            },
          })}
        />
      </Form.Item>
      <div className="form-actions">
        <Button
          htmlType="submit"
          type="primary"
          block
          loading={mutation.isLoading}
        >
          Sačuvaj
        </Button>
      </div>
    </Form>
  );
}

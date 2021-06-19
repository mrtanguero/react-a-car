import { Form, Input, message, Button } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { changePassword } from '../../services/account';

export default function PasswordChangeForm({ closeModal }) {
  const { t } = useTranslation();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
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
        if (error.response.data.message === "Old Password didn't match") {
          setError('old_password', {
            type: 'manual',
            message: 'Pogrešna lozinka',
          });
        }
      },
    }
  );

  const onSubmit = (data) => {
    if (data.new_password !== data.confirm_password) {
      setError('new_password', {
        type: 'manual',
        message: 'Unešena i potvrđena vrijednost moraju biti iste',
      });

      setError('confirm_password', {
        type: 'manual',
        message: 'Unešena i potvrđena vrijednost moraju biti iste',
      });
      return;
    }
    mutation.mutate(data);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        label={t('formLabels.oldPassword')}
        help={errors.old_password && errors.old_password.message}
        validateStatus={errors.old_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder={t('placeholders.oldPassword')}
          {...register('old_password', {
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('formLabels.newPassword')}
        help={errors.new_password && errors.new_password.message}
        validateStatus={errors.new_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder={t('placeholders.newPassword')}
          {...register('new_password', {
            required: {
              value: true,
              message: t('errorMessages.requiredField'),
            },
            minLength: {
              value: 4,
              message: 'Minimalna dužina passworda je 4 karaktera',
            },
            maxLength: {
              value: 12,
              message: 'Maksimalna dužina passworda je 12 karaktera',
            },
            pattern: {
              value: /^[A-Za-z0-9!#%&]+$/i,
              message: 'Samo mala i velika slova i karakteri !, #, % i &',
            },
          })}
        />
      </Form.Item>
      <Form.Item
        label={t('formLabels.confirmPassword')}
        help={errors.confirm_password && errors.confirm_password.message}
        validateStatus={errors.confirm_password && 'error'}
        hasFeedback
      >
        <Input
          type="password"
          placeholder={t('placeholders.confirmPassword')}
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
          {t('buttons.save')}
        </Button>
      </div>
    </Form>
  );
}

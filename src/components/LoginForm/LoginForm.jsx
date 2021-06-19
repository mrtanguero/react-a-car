import { Button, Card, Form, Input, message, Typography } from 'antd';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Redirect, useHistory } from 'react-router';
import { useMutation } from 'react-query';
import authContext from '../../context/authContext';
import { login } from '../../services/account';
import { useTranslation } from 'react-i18next';

const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function LoginForm() {
  const auth = useContext(authContext);
  const history = useHistory();
  const { t } = useTranslation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const mutation = useMutation((data) => login(data), {
    onSuccess: (response) => {
      localStorage.setItem('jwt', response.data.access_token);
      auth.setJwt(response.data.access_token);
      history.replace('/');
    },
    onError: (error) => {
      if (error.response.data.error === 'Unauthorized') {
        message.error(t('errorMessages.unauthorized'));
      } else {
        message.error(error.response.data.error);
      }
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      {auth.jwt ? (
        <Redirect to="/" />
      ) : (
        <div
          className="login-container"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: '400px' }}>
            <Typography.Title
              level={3}
              style={{ textAlign: 'center', marginBottom: 24 }}
            >
              {t('pageHeaders.login')}
            </Typography.Title>
            <Card>
              <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
                <Form.Item
                  label={t('tableHeaders.email')}
                  help={errors.email && errors.email.message}
                  validateStatus={errors.email && 'error'}
                  hasFeedback
                >
                  <Input
                    placeholder={t('placeholders.yourEmail')}
                    {...register('email', {
                      required: {
                        value: true,
                        message: t('errorMessages.requiredField'),
                      },
                      pattern: {
                        value: emailRegEx,
                        message: t('errorMessages.emailInvalid'),
                      },
                    })}
                  />
                </Form.Item>
                <Form.Item
                  label={t('formLabels.password')}
                  help={errors.password && errors.password.message}
                  validateStatus={errors.password && 'error'}
                  hasFeedback
                >
                  <Input
                    type="password"
                    placeholder={t('placeholders.password')}
                    {...register('password', {
                      required: {
                        value: true,
                        message: t('errorMessages.requiredField'),
                      },
                      minLength: {
                        value: 4,
                        message: t('errorMessages.minPassLength'),
                      },
                      maxLength: {
                        value: 12,
                        message: t('errorMessages.maxPassLength'),
                      },
                      pattern: {
                        value: /^[A-Za-z0-9!#%&]+$/i,
                        message: t('errorMessages.allowedChars'),
                      },
                    })}
                  />
                </Form.Item>
                <div className="form-actions">
                  <Button
                    loading={mutation.isLoading}
                    type="primary"
                    htmlType="submit"
                    block
                  >
                    {t('buttons.login')}
                  </Button>
                </div>
              </Form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}

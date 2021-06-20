import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Upload } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { InboxOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import formDataContext from '../../../context/formDataContext';

const { Dragger } = Upload;

const dummyRequest = ({ _, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

export default function SecondStep({ setStep }) {
  const { data, setValues } = useContext(formDataContext);
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: { photos: data.photos },
  });

  const onRemove = (photo) => {
    if (!photo.originFileObj) {
      setValues({
        photoDeleteList: data?.photoDeleteList.concat(photo.uid),
      });
    }
  };

  const onSubmit = (secondStepData) => {
    if (secondStepData.photos.fileList.length === 0) {
      setError('photos', {
        type: 'required',
        message: t('errorMessages.photoRequired'),
      });
      return;
    }
    setValues(secondStepData);
    setStep(2);
  };

  return (
    <Form onSubmitCapture={handleSubmit(onSubmit)} layout="vertical">
      <Form.Item
        help={errors['photos'] && errors['photos'].message}
        validateStatus={errors['photos'] && 'error'}
      >
        <Controller
          name="photos"
          control={control}
          rules={{
            required: {
              value: true,
              message: t('errorMessages.photoRequired'),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Dragger
              onChange={onChange}
              multiple
              maxCount={5}
              accept="image/*"
              listType="picture"
              fileList={value?.fileList?.length ? value.fileList : undefined}
              onPreview={() => {}}
              onRemove={onRemove}
              customRequest={dummyRequest}
              children={
                <>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">{t('content.uploadPhotos')}</p>
                  <p className="ant-upload-hint">
                    {t('content.uploadPhotosSecondary')}
                  </p>
                </>
              }
            />
          )}
        />
      </Form.Item>

      <div className="form-actions">
        <Button style={{ margin: '0 8px' }} onClick={() => setStep(0)}>
          {t('buttons.back')}
        </Button>
        <Button type="primary" htmlType="submit">
          {t('buttons.nextStep')}
        </Button>
      </div>
    </Form>
  );
}

SecondStep.propTypes = {
  setStep: PropTypes.func,
};

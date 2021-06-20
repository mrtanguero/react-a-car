import React, { useContext } from 'react';
import './ReviewStep.css';
import PropTypes from 'prop-types';
import { Button, Descriptions, Divider, Image, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import formDataContext from '../../../context/formDataContext';
import {
  createVehicle,
  deletePhoto,
  updateVehicle,
} from '../../../services/cars';

export default function ReviewStep({
  setStep,
  closeModal,
  vehicleId,
  disabled,
}) {
  const { data, setData } = useContext(formDataContext);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const deletePhotoMutation = useMutation('deletePhoto', deletePhoto, {
    onSuccess: () => console.log('Deleted photo'),
  });
  const createCarMutation = useMutation('createVehicle', createVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      message.success(t('successMessages.created'));
      setData({});
      setStep(0);
      closeModal();
    },
    onError: (err) => console.log(err.response.data.message),
  });

  const updateCarMutation = useMutation(
    ['updateVehicle', vehicleId],
    (data) => updateVehicle(data, vehicleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('vehicles');
        data?.photoDeleteList.forEach((id) => deletePhotoMutation.mutate(id));
        queryClient.invalidateQueries('getVehicle');
        setStep(0);
        setData({});
        closeModal();
        message.success(t('successMessages.updated'));
      },
      onError: (error) => message.error(error.response.data.message),
    }
  );

  const handleSubmit = () => {
    const formData = new FormData();
    data?.photos?.fileList?.forEach((f) => {
      if (f.originFileObj) {
        formData.append('photo[]', f.originFileObj, f.name);
      }
    });
    Object.entries(data).forEach((entry) => {
      if (entry !== 'photos') {
        formData.append(entry[0], entry[1]);
      }
    });
    if (!vehicleId) {
      createCarMutation.mutate(formData);
    } else {
      updateCarMutation.mutate(formData);
    }
  };

  return (
    <>
      <div className="vehicle-info">
        <Descriptions
          size="small"
          column={1}
          bordered
          labelStyle={{ width: '50%', textAlign: 'right' }}
          contentStyle={{ color: 'grey' }}
        >
          <Descriptions.Item label="Broj registracije">
            {data?.plate_no}
          </Descriptions.Item>
          <Descriptions.Item label="Godina proizvodnje">
            {data?.production_year}
          </Descriptions.Item>
          <Descriptions.Item label="Tip vozila">
            {data?.car_type?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Broj sjedišta">
            {data?.no_of_seats}
          </Descriptions.Item>
          <Descriptions.Item label="Cijena po danu">
            {data?.price_per_day}€
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Divider />
      <div className="preview-group-container">
        <Image.PreviewGroup>
          {data?.photos?.fileList?.map((photo) => {
            return (
              <Image
                key={photo.uid}
                width={150}
                height={150}
                src={
                  photo.originFileObj
                    ? URL.createObjectURL(photo.originFileObj)
                    : photo.thumbUrl
                }
              />
            );
          })}
        </Image.PreviewGroup>
      </div>
      {!disabled && (
        <>
          <Divider />
          <div className="form-actions">
            <Button style={{ margin: '0 8px' }} onClick={() => setStep(1)}>
              {t('buttons.back')}
            </Button>
            <Button
              type="primary"
              loading={createCarMutation.isLoading}
              onClick={handleSubmit}
            >
              {t('buttons.save')}
            </Button>
          </div>
        </>
      )}
    </>
  );
}

ReviewStep.propTypes = {
  setStep: PropTypes.func,
  closeModal: PropTypes.func,
  vehicleId: PropTypes.number,
  disabled: PropTypes.bool,
};

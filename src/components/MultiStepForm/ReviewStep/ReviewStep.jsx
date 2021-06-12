import { Button, Image, message } from 'antd';
import './ReviewStep.css';
import React, { useContext, useEffect } from 'react';
import formDataContext from '../../../context/formDataContext';
import { useMutation, useQueryClient } from 'react-query';
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
  const queryClient = useQueryClient();

  const deletePhotoMutation = useMutation('deletePhoto', deletePhoto, {
    onSuccess: () => console.log('Deleted photo'),
  });
  const createCarMutation = useMutation('createVehicle', createVehicle, {
    onSuccess: () => {
      queryClient.invalidateQueries('vehicles');
      message.success('Created!');
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
      onSuccess: (response) => {
        console.log(response);
        queryClient.invalidateQueries('vehicles');
        data?.photoDeleteList.forEach((id) => deletePhotoMutation.mutate(id));
        queryClient.invalidateQueries('getVehicle');
        setStep(0);
        closeModal();
        message.success('Updated!');
      },
      onError: (err) => message.error(err.response.data.message),
    }
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleSubmit = () => {
    console.log(data);

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
        <div className="form-actions">
          <Button style={{ margin: '0 8px' }} onClick={() => setStep(1)}>
            Korak nazad
          </Button>
          <Button
            type="primary"
            loading={createCarMutation.isLoading}
            onClick={handleSubmit}
          >
            Sačuvaj
          </Button>
        </div>
      )}
    </>
  );
}

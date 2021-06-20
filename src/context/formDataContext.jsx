import { Spin } from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getVehicle } from '../services/cars';

const formDataContext = React.createContext({
  data: {
    plate_no: '',
    production_year: 0,
    car_type_id: 0,
    no_of_seats: 0,
    price_per_day: 0,
    photos: [],
  },
  setValues: () => {},
  setData: () => {},
});

export const FormDataProvider = ({ children, vehicleId }) => {
  const [data, setData] = useState({});
  const [queryIsEnabled, setQueryIsEnabled] = useState(!!vehicleId);

  const { isLoading } = useQuery(
    ['getVehicle', vehicleId],
    () => getVehicle(vehicleId),
    {
      enabled: queryIsEnabled,
      onSuccess: ({ data }) => {
        setData({
          ...data,
          photos: {
            fileList: data?.photos?.map((photo) => {
              return {
                uid: photo.id,
                name: `${photo.id}.${photo.photo.split('.').pop()}`,
                thumbUrl: `http://127.0.0.1:8000/${photo.photo}`,
              };
            }),
          },
        });
        setQueryIsEnabled(false);
      },
      onError: (error) => console.log(error.response),
    }
  );

  const setValues = (values) => {
    setData({
      ...data,
      ...values,
    });
  };

  useEffect(() => {
    setQueryIsEnabled(true);
  }, [vehicleId]);

  return (
    <formDataContext.Provider value={{ data, setValues, setData }}>
      <Spin spinning={isLoading}>{children}</Spin>
    </formDataContext.Provider>
  );
};

export default formDataContext;

import React, { useState } from 'react';

const formDataContext = React.createContext({
  data: {
    platesNumber: '',
    productionYear: 0,
    vehicleType: 0,
    vehicleSeatsNum: 0,
    pricePerDay: 0,
    photos: [],
  },
  setValues: () => {},
});

export const FormDataProvider = ({ children }) => {
  const [data, setData] = useState({});

  const setValues = (values) => {
    setData({
      ...data,
      ...values,
    });
  };

  return (
    <formDataContext.Provider value={{ data, setValues }}>
      {children}
    </formDataContext.Provider>
  );
};

export default formDataContext;

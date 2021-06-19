import React, { useState } from 'react';

const modalContext = React.createContext({
  modalProps: {
    title: '',
    children: null,
    visible: false,
    onOk: () => {},
    onCancel: () => {},
  },
  setModalProps: () => {},
});

export const ModalPropsProvider = (props) => {
  const [modalProps, setModalProps] = useState({});

  return (
    <modalContext.Provider value={{ modalProps, setModalProps }}>
      {props.children}
    </modalContext.Provider>
  );
};

export default modalContext;

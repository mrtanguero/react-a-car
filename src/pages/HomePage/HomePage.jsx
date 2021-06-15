// import { Button, Form } from 'antd';
import React, { useContext } from 'react';
// import MyAsyncSelect from '../../components/MyAsyncSelect/MyAsyncSelect';
import authContext from '../../context/authContext';
// import { getClients } from '../../services/clients';

export default function HomePage() {
  const auth = useContext(authContext);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };
  return (
    <>
      <div>Dobrodošli u aplikaciju {auth?.user?.name}!</div>
      {/* <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Button htmlType="submit">Submit</Button>
      </Form> */}
    </>
  );
}

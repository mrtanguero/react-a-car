import React, { useContext } from 'react';
import authContext from '../../context/authContext';

export default function HomePage() {
  const auth = useContext(authContext);

  return <div>Dobrodošli u aplikaciju {auth?.user?.name}!</div>;
}

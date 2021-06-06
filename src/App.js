import React, { useContext } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Modal } from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import modalContext from './context/modalContext';

import MainLayout from './layout/MainLayout/MainLayout';
import ClientsPage from './pages/ClientsPage/ClientsPage';
import CarsPage from './pages/CarsPage/CarsPage';
import CreateReservationPage from './pages/CreateReservationPage/CreateReservationPage';
import ReservationsPage from './pages/ReservationsPage/ReservationsPage';
import HomePage from './pages/HomePage/HomePage';

const App = () => {
  const modalCtx = useContext(modalContext);

  return (
    <MainLayout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/clients">
          <ClientsPage />
        </Route>
        <Route path="/cars">
          <CarsPage />
        </Route>
        <Route path="/reservations/create">
          <CreateReservationPage />
        </Route>
        <Route path="/reservations">
          <ReservationsPage />
        </Route>
      </Switch>
      <Modal {...modalCtx.modalProps} />
    </MainLayout>
  );
};

export default App;

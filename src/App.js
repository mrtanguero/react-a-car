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
import LoginForm from './components/LoginForm/LoginForm';
import authContext from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const modalCtx = useContext(modalContext);
  const auth = useContext(authContext);

  return (
    <MainLayout>
      <Switch>
        <ProtectedRoute jwt={auth.jwt} path="/" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute jwt={auth.jwt} path="/clients">
          <ClientsPage />
        </ProtectedRoute>
        <ProtectedRoute jwt={auth.jwt} path="/cars">
          <CarsPage />
        </ProtectedRoute>
        <ProtectedRoute jwt={auth.jwt} path="/reservations/create">
          <CreateReservationPage />
        </ProtectedRoute>
        <ProtectedRoute jwt={auth.jwt} path="/reservations">
          <ReservationsPage />
        </ProtectedRoute>
        <Route path="/login">
          <LoginForm />
        </Route>
      </Switch>
      <Modal {...modalCtx.modalProps} />
    </MainLayout>
  );
};

export default App;

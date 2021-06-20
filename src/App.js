import React, { useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
import Page404 from './pages/Page404/Page404';
import Page403 from './pages/Page403/Page403';

const App = () => {
  const modalCtx = useContext(modalContext);
  const auth = useContext(authContext);

  return (
    <MainLayout>
      <Switch>
        <ProtectedRoute auth={auth} path="/" exact={true}>
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute auth={auth} path="/clients">
          <ClientsPage />
        </ProtectedRoute>
        <ProtectedRoute auth={auth} path="/cars">
          <CarsPage />
        </ProtectedRoute>
        <ProtectedRoute auth={auth} path="/reservations/create">
          <CreateReservationPage />
        </ProtectedRoute>
        <ProtectedRoute auth={auth} path="/reservations">
          <ReservationsPage />
        </ProtectedRoute>
        <Route path="/login">
          <LoginForm />
        </Route>
        <Route path="/unauthorized">
          <Page403 />
        </Route>
        <Route path="/404">
          <Page404 />
        </Route>
        <Route path="*">
          <Redirect to="/404" />
        </Route>
      </Switch>
      <Modal {...modalCtx.modalProps} />
    </MainLayout>
  );
};

export default App;

import React from "react";
import "./App.css";
import "antd/dist/antd.css";
import MainLayout from "./layout/MainLayout/MainLayout";
import { Redirect, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/clients" />
        </Route>
        <Route path="/clients">Clients Page</Route>
        <Route path="/cars">Cars Page</Route>
        <Route path="/reservations/create">Create new reservation</Route>
        <Route path="/reservations">Reservations Page</Route>
      </Switch>
    </MainLayout>
  );
};

export default App;

import { Card, Collapse } from 'antd';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import authContext from '../../context/authContext';
import { getReservations } from '../../services/reservations';

const { Panel } = Collapse;

export default function HomePage() {
  const auth = useContext(authContext);
  const [reservations, setReservations] = useState([]);

  useQuery('getUserReservations', getReservations, {
    onSuccess: ({ data: { data } }) => {
      setReservations(data);
    },
    enabled: auth?.user?.roleId === 2,
  });

  return (
    <>
      {auth?.user?.roleId === 1 && (
        <div>Dobrodošli u aplikaciju {auth?.user?.name}!</div>
      )}
      {auth?.user?.roleId === 2 && (
        <>
          <Collapse accordion defaultActiveKey={['1']}>
            <Panel header="Buduće rezervacije" key="1">
              {reservations
                .filter(
                  (reservation) =>
                    new Date(reservation.from_date).getTime() >
                    new Date().getTime()
                )
                .map((reservation) => {
                  return (
                    <Card style={{ width: 300 }} key={reservation.id}>
                      <p>{reservation.vehicle.plate_no}</p>
                      <p>
                        {reservation.from_date}-{reservation.to_date}
                      </p>
                    </Card>
                  );
                })}
            </Panel>
            <Panel header="Rezervacije u toku" key="2">
              {reservations
                .filter(
                  (reservation) =>
                    new Date(reservation.from_date).getTime() <
                      new Date().getTime() &&
                    new Date(reservation.to_date).getTime() >
                      new Date().getTime()
                )
                .map((reservation) => {
                  return (
                    <Card style={{ width: 300 }}>
                      <p>{reservation.vehicle.plate_no}</p>
                      <p>
                        {reservation.from_date}-{reservation.to_date}
                      </p>
                    </Card>
                  );
                })}
            </Panel>
            <Panel header="Prošle rezervacije" key="3">
              {reservations
                .filter(
                  (reservation) =>
                    new Date(reservation.to_date).getTime() <
                    new Date().getTime()
                )
                .map((reservation) => {
                  return (
                    <Card style={{ width: 300 }}>
                      <p>{reservation.vehicle.plate_no}</p>
                      <p>
                        {reservation.from_date}-{reservation.to_date}
                      </p>
                    </Card>
                  );
                })}
            </Panel>
          </Collapse>
        </>
      )}
    </>
  );
}

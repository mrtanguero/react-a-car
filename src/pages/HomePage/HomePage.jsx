import { Card, Col, Collapse, PageHeader, Row, Typography } from 'antd';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import authContext from '../../context/authContext';
import { getReservations } from '../../services/reservations';
import { CaretRightOutlined } from '@ant-design/icons';
import ReservationCard from '../../components/ReservationCard/ReservationCard';

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
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Card>
            <Typography.Title level={3} style={{ marginTop: 8 }}>
              Dobrodošli u aplikaciju, {auth?.user?.name}!
            </Typography.Title>
          </Card>
        </div>
      )}
      {auth?.user?.roleId === 2 && (
        <>
          <PageHeader title="Vaše rezervacije" />
          <Collapse
            accordion
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel header="Buduće rezervacije" key="1">
              <Row gutter={[16, 16]}>
                {reservations
                  .filter(
                    (reservation) =>
                      new Date(reservation.from_date).getTime() >
                      new Date().setHours(0, 0, 0, 0)
                  )
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((reservation) => {
                    return (
                      <Col xs={24} md={12} lg={8} key={reservation.id}>
                        <ReservationCard reservation={reservation} />
                      </Col>
                    );
                  })}
              </Row>
            </Panel>
            <Panel header="Rezervacije u toku" key="2">
              <Row gutter={[16, 16]}>
                {reservations
                  .filter(
                    (reservation) =>
                      new Date(reservation.from_date).getTime() <=
                        new Date().setHours(0, 0, 0, 0) &&
                      new Date(reservation.to_date).getTime() >=
                        new Date().setHours(0, 0, 0, 0)
                  )
                  .map((reservation) => {
                    return (
                      <Col xs={24} sm={12} lg={8} key={reservation.id}>
                        <ReservationCard reservation={reservation} />
                      </Col>
                    );
                  })}
              </Row>
            </Panel>
            <Panel header="Prošle rezervacije" key="3">
              <Row gutter={[16, 16]}>
                {reservations
                  .filter(
                    (reservation) =>
                      new Date(reservation.to_date).getTime() <
                      new Date().setHours(0, 0, 0, 0)
                  )
                  .map((reservation) => {
                    return (
                      <Col xs={24} sm={12} lg={8} key={reservation.id}>
                        <ReservationCard reservation={reservation} />
                      </Col>
                    );
                  })}
              </Row>
            </Panel>
          </Collapse>
        </>
      )}
    </>
  );
}

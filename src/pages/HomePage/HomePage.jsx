import React, { useContext, useState } from 'react';
import './HomePage.css'
import { Card, Col, Collapse, PageHeader, Row, Typography } from 'antd';
import { useQuery } from 'react-query';
import authContext from '../../context/authContext';
import { getReservations } from '../../services/reservations';
import { CaretRightOutlined, InboxOutlined } from '@ant-design/icons';
import ReservationCard from '../../components/ReservationCard/ReservationCard';
import { useTranslation } from 'react-i18next';

const { Panel } = Collapse;

export default function HomePage() {
  const auth = useContext(authContext);
  const [reservations, setReservations] = useState([]);
  const { t } = useTranslation();

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
              {t('content.welcomeMessage', { name: auth?.user?.name })}
            </Typography.Title>
          </Card>
        </div>
      )}
      {auth?.user?.roleId === 2 && (
        <>
          <PageHeader title={t('pageHeaders.yourReservations')} />
          <Collapse
            accordion
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
          >
            <Panel header={t('pageHeaders.upcomingReservations')} key="1">
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                {reservations.filter(
                  (reservation) =>
                    new Date(reservation.from_date).getTime() >
                    new Date().setHours(0, 0, 0, 0)
                ).length ? (
                  reservations
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
                    })
                ) : (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <p
                      style={{
                        fontSize: '3rem',
                        color: 'grey',
                        marginBottom: 0,
                      }}
                    >
                      <InboxOutlined />
                    </p>
                    <p style={{ color: 'grey' }}>
                      {t('content.noReservations')}
                    </p>
                  </div>
                )}
              </Row>
            </Panel>
            <Panel header={t('pageHeaders.currentReservations')} key="2">
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                {reservations.filter(
                  (reservation) =>
                    new Date(reservation.from_date).getTime() <=
                      new Date().setHours(0, 0, 0, 0) &&
                    new Date(reservation.to_date).getTime() >=
                      new Date().setHours(0, 0, 0, 0)
                ).length ? (
                  reservations
                    .filter(
                      (reservation) =>
                        new Date(reservation.from_date).getTime() <=
                          new Date().setHours(0, 0, 0, 0) &&
                        new Date(reservation.to_date).getTime() >=
                          new Date().setHours(0, 0, 0, 0)
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((reservation) => {
                      return (
                        <Col xs={24} sm={12} lg={8} key={reservation.id}>
                          <ReservationCard reservation={reservation} />
                        </Col>
                      );
                    })
                ) : (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <p
                      style={{
                        fontSize: '3rem',
                        color: 'grey',
                        marginBottom: 0,
                      }}
                    >
                      <InboxOutlined />
                    </p>
                    <p style={{ color: 'grey' }}>
                      {t('content.noReservations')}
                    </p>
                  </div>
                )}
              </Row>
            </Panel>
            <Panel header={t('pageHeaders.passedReservations')} key="3">
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                {reservations.filter(
                  (reservation) =>
                    new Date(reservation.to_date).getTime() <
                    new Date().setHours(0, 0, 0, 0)
                ).length ? (
                  reservations
                    .filter(
                      (reservation) =>
                        new Date(reservation.to_date).getTime() <
                        new Date().setHours(0, 0, 0, 0)
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                    .map((reservation) => {
                      return (
                        <Col xs={24} sm={12} lg={8} key={reservation.id}>
                          <ReservationCard reservation={reservation} />
                        </Col>
                      );
                    })
                ) : (
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <p
                      style={{
                        fontSize: '3rem',
                        color: 'grey',
                        marginBottom: 0,
                      }}
                    >
                      <InboxOutlined />
                    </p>
                    <p style={{ color: 'grey' }}>
                      {t('content.noReservations')}
                    </p>
                  </div>
                )}
              </Row>
            </Panel>
          </Collapse>
        </>
      )}
    </>
  );
}

import 'antd/dist/antd.css';
import ReservationCard from './ReservationCard';

export default {
  title: 'Components/ReservationCard',
  component: ReservationCard,
};

const Template = (args) => <ReservationCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  reservation: {
    id: '99',
    vehicle: {
      plate_no: 'PG DU916',
    },
    from_date: '2021-06-15',
    to_date: '2021-06-20',
    rent_location: {
      name: 'Podgorica',
    },
    return_location: {
      name: 'Tivat',
    },
  },
};

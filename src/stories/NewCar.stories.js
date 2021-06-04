import NewCar from "../components/NewCar/NewCar";
import "antd/dist/antd.css";

export default {
  title: "Components/NewCar",
  component: NewCar,
};

const Template = (args) => <NewCar {...args} />;

export const Default = Template.bind({});

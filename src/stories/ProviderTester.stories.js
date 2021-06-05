import "antd/dist/antd.css";
import { AuthProvider } from "../context/authContext";
import ProviderTester from "./ProviderTester";

export default {
  title: "Components/ProviderTester",
  component: ProviderTester,
  decorators: [
    (Story) => (
      <AuthProvider>
        <Story />
      </AuthProvider>
    ),
  ],
};

const Template = (args) => <ProviderTester {...args} />;

export const Default = Template.bind({});

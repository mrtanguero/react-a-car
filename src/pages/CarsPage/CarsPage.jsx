import { Button } from "antd";
import React, { useContext } from "react";
import modalContext from "../../context/modalContext";
import { CarOutlined } from "@ant-design/icons";
import NewCar from "../../components/NewCar/NewCar";

export default function ClientsPage() {
  const modalCtx = useContext(modalContext);

  const handleCancelModal = () => {
    modalCtx.setModalProps({ ...modalCtx.modalProps, visible: false });
  };

  const handleClick = () => {
    modalCtx.setModalProps({
      title: "Add new car",
      children: <NewCar />,
      visible: true,
      onOk: () => {},
      onCancel: handleCancelModal,
      footer: null,
    });
  };

  return (
    <div>
      This is Clients Page.{" "}
      <Button onClick={handleClick}>
        <CarOutlined />
        Dodaj vozilo
      </Button>
    </div>
  );
}

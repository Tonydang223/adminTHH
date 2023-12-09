import React, { useState } from "react";
import { Modal } from "antd";
import EventEmitter from "eventemitter3";
const events = new EventEmitter();

export default function ModalFirm() {
  const [modalProps, setModalProps] = useState({});
  const [show, setShow] = useState(false);

  React.useEffect(() => {
    const onModal = (props) => {
      setShow(true);
      setModalProps(props);
    };
    const closeModal = () => {
      setShow(false);
      setTimeout(() => {
        setModalProps({});
      }, 300);
    };

    events.addListener("SHOW_MODAL", onModal);
    events.addListener("CLOSE_MODAL", closeModal);

    return () => {
      events.removeAllListeners("SHOW_MODAL");
      events.removeAllListeners("CLOSE_MODAL");
    };
  }, []);

  return (
    <Modal
      title="Basic Modal"
      open={show}
      onOk={modalProps?.onOk}
      onCancel={modalProps?.onCancel}
    >
      {modalProps?.body}
    </Modal>
  );
}

export const showGlobal = (props) => {
  events.emit("SHOW_MODAL", props);
};

export const closeGlobal = () => {
  events.emit("CLOSE_MODAL");
  return true;
};

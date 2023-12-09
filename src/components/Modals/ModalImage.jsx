import { Modal } from "antd";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";

export default function ModalImage({
  previewImage,
  previewTitle,
  previewOpen,
  handleCancel,
  isVid,
}) {
  return (
    <Modal
      open={previewOpen}
      title={previewTitle}
      footer={null}
      onCancel={handleCancel}
      destroyOnClose
    >
      {isVid ? (
        <ReactPlayer url={previewImage} width="100%" height="300px" controls/>
      ) : (
          <img
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
      )}
    </Modal>
  );
}

ModalImage.propTypes = {
  previewImage: PropTypes.string,
  previewTitle: PropTypes.string,
  previewOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  isVid: PropTypes.bool,
};

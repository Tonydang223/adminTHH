import LayoutDB from "../LayoutDashBoard/LayoutDB";
import { Button, Form, Input, Upload, message } from "antd";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils/readFile";
import ModalImage from "../Modals/ModalImage";
import { useEditMeMutation } from "./profile.service";
const FormItem = Form.Item;

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  console.log("🚀 ~ file: Profile.jsx:15 ~ Profile ~ user:", user)
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [, setNumLen] = useState(0);

  const [editMe, editMeRes] = useEditMeMutation();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        thumbnail: user.thumbnail ? [{ ...user.thumbnail }] : [],
        firstName: user.firstName,
        email: user.email,
      });
    }
  }, [user, form]);

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;

    const fmData = new FormData();
    const url =
      "https://api.cloudinary.com/v1_1/" +
      process.env.REACT_APP_CLOUD_NAME +
      "/auto/upload";
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("file", file);
    fmData.append("upload_preset", "avatar");
    fmData.append("api_key", process.env.REACT_APP_CLOUD_API_KEY_CLOUD);
    fmData.append("api_secret", process.env.REACT_APP_CLOUD_API_SECRET_CLOUD);

    try {
      if (file.size / 1024 / 1024 > 1.5) {
        onError("Files not larger than 1.5mb");
      } else {
        const res = await axios.post(url, fmData, config);

        onSuccess(res.data?.url);
      }
    } catch (err) {
      onError({ err });
    }
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleSubmit = async (e) => {
    let editedValues = { ...e };
    if (editedValues.thumbnail?.length < 1) {
      editedValues = { ...editedValues, thumbnail: {} };
    } else {
      if (editedValues.thumbnail[0].status === "error") {
        message.error("File img is fail! Try again");
      } else {
        editedValues = {
          ...editedValues,
          thumbnail: {
            uid: e.thumbnail[0].uid,
            url: e.thumbnail[0].response || e.thumbnail[0].url,
            name: e.thumbnail[0].name,
            status: e.thumbnail[0].status,
          },
        };
        await editMe(editedValues);
      }
    }
  };

  useEffect(() => {
    if (editMeRes.isSuccess) {
      message.success("Cập nhập thành công !");
    }
    if (editMeRes.isError) {
      if (Array.isArray(editMeRes.error.data.error)) {
        editMeRes.error.data.error.forEach((el) => message.error(el.message));
      } else {
        message.error(editMeRes.error.data.msg);
      }
    }
  }, [editMeRes.isLoading]);

  const onChangeImgs = async (fileList) => {
    console.log(
      "🚀 ~ file: Profile.jsx:126 ~ onChangeImgs ~ fileList:",
      fileList
    );
    setNumLen(fileList.fileList.length);
  };

  return (
    <LayoutDB>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="horizontal"
        onFinish={handleSubmit}
        form={form}
        className="login-form"
      >
        <FormItem
          name="thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            customRequest={uploadImage}
            listType="picture-card"
            onChange={onChangeImgs}
            beforeUpload={(file) => {
              if (file && file.size / 1024 / 1024 > 1.5) {
                message.error("Dung lượng quá tải");
                return Upload.LIST_IGNORE;
              } else {
                return true;
              }
            }}
            onPreview={handlePreview}
            accept={"image/*"}
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          </Upload>
        </FormItem>

        <ModalImage
          previewImage={previewImage}
          previewOpen={previewOpen}
          previewTitle={previewTitle}
          handleCancel={handleCancel}
        />
        <FormItem
          name={"firstName"}
          rules={[{ required: true, message: "Please enter your username !" }]}
        >
          <Input
            placeholder="Username"
            prefix={<FaRegUser color="#ACADA8" />}
          />
        </FormItem>
        <FormItem
          rules={[{ required: true, message: "Please enter your email !" }]}
          name={"email"}
        >
          <Input
            disabled={true}
            name={"email"}
            placeholder="Email"
            prefix={<FaRegUser color="#ACADA8" />}
          />
        </FormItem>
        <FormItem>
          <Button
            style={{ width: "100%", background: "#7F1416", height: "37px" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Lưu
          </Button>
        </FormItem>
      </Form>
    </LayoutDB>
  );
}

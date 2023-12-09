import {
  Button,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import ModalImage from "../../../components/Modals/ModalImage";
import CkEdit from "../../../components/CkEditor5/CkEdit";

import { useParams, useNavigate } from "react-router-dom";
import {
  useAddPostMutation,
  useEditPostMutation,
  useGetOnePostQuery,
} from "../post.service";
const FormItem = Form.Item;

export default function AddProduct() {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { postId } = useParams();
  const navigate = useNavigate();
  const { data, isError } = useGetOnePostQuery(postId, {
    skip: !postId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      const editData = { ...data, thumbnail: [data.thumbnail] };
      form.setFieldsValue(editData);
    }

    if (postId && isError) {
      navigate("/product");
    }
  }, [data, form, isError, navigate, postId]);

  const [createPost, createPostRes] = useAddPostMutation();
  const [editPost, editPostRes] = useEditPostMutation();
  const onChangeEditor = (event, editor) => {
    const dataEditorDes = editor.getData();
    form.setFieldValue("desc", dataEditorDes);
  };
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
    fmData.append("upload_preset", "postsz");
    fmData.append("api_key", process.env.REACT_APP_CLOUD_API_KEY_CLOUD);
    fmData.append("api_secret", process.env.REACT_APP_CLOUD_API_SECRET_CLOUD);

    try {
      if (file.size / 1024 / 1024 > 9) {
        onError("Files not larger than 9mb");
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
      file.preview = await file.originFileObj;
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
        console.log(
          "🚀 ~ file: AddPost.jsx:109 ~ handleSubmit ~ editedValues:",
          editedValues
        );
        if (!postId) {
          await createPost(editedValues);
        } else {
          await editPost({
            id: postId,
            body: editedValues,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (!postId) {
      if (createPostRes.isSuccess) {
        message.success("The post was created successfully !");
        form.resetFields();
      }
      if (createPostRes.isError) {
        if (Array.isArray(createPostRes.error.data.error)) {
            createPostRes.error.data.error.forEach((el) =>
            message.error(el.message)
          );
        } else {
          message.error(createPostRes.error.data.msg);
        }
      }
    } else {
      if (editPostRes.isSuccess) {
        message.success("The post was edited successfully !");
      }
      if (editPostRes.isError) {
        if (Array.isArray(editPostRes.error.data.error)) {
            editPostRes.error.data.error.forEach((el) =>
            message.error(el.message)
          );
        } else {
          message.error(editPostRes.error.data.msg);
        }
      }
    }
  }, [createPostRes.isLoading, editPostRes.isLoading]);

  return (
    <>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        className="login-form"
      >
        <FormItem
          name="thumbnail"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "Please select a file!",
            },
          ]}
        >
          <Upload
            customRequest={uploadImage}
            listType="picture-card"
            beforeUpload={(file) => {
              if (file && file.size / 1024 / 1024 > 9) {
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
          name={"title"}
          label="Tiều đề"
          rules={[{ required: true, message: "Please enter the title !" }]}
        >
          <Input placeholder="Tiêu đề" />
        </FormItem>

        <FormItem
          name={"desc"}
          label="Mô tả"
          rules={[{ required: true, message: "Please enter the desc !" }]}
        >
          <CkEdit
            onChange={onChangeEditor}
            data={data ? data.desc : ''}
          />
        </FormItem>
        <FormItem>
          <Button
            style={{ width: "100%", background: "#7F1416", height: "37px" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {postId ? "Sửa" : "Thêm"}
          </Button>
        </FormItem>
      </Form>
    </>
  );
}

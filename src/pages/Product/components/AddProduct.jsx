import {
  Button,
  Form,
  Input,
  Upload,
  message,
  Select,
  InputNumber,
} from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";

import { getBase64 } from "../../../utils/readFile";
import LayoutDB from "../../../components/LayoutDashBoard/LayoutDB";
import { useEffect, useState } from "react";
import ModalImage from "../../../components/Modals/ModalImage";
import CkEdit from "../../../components/CkEditor5/CkEdit";
import {
  useCreateProductMutation,
  useEditProductMutation,
  useGetOneProductQuery,
} from "../product.service";
import { useParams, useNavigate } from "react-router-dom";
const FormItem = Form.Item;

export default function AddProduct() {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { productId } = useParams();
  const navigate = useNavigate();
  const { data, isError } = useGetOneProductQuery(productId, {
    skip: !productId,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data) {
      const editData = { ...data, size: Number(data.size?.split(" ")[0]) };
      form.setFieldsValue(editData);
    }

    if (productId && isError) {
      navigate("/product");
    }
  }, [data, form, isError, navigate, productId]);

  const [valueAffSizeInput, setValueAffSizeInput] = useState("ml");

  const [createProduct, createProductRes] = useCreateProductMutation();
  const [editProduct, editProductRes] = useEditProductMutation();
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
    fmData.append("upload_preset", "products");
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
      editedValues = { ...editedValues, thumbnail: [] };
    } else {
      editedValues = {
        ...editedValues,
        size: String(editedValues.size) + " " + valueAffSizeInput,
        imgs: editedValues.imgs
          .filter((i) => i.status !== "error")
          .map((i) => {
            return {
              uid: i.uid,
              url: i.response || i.url,
              name: i.name,
              status: i.status,
            };
          }),
      };
    }
    if (!productId) {
      await createProduct(editedValues);
    } else {
      await editProduct({
        id: productId,
        body: editedValues,
      });
    }
  };

  useEffect(() => {
    if (!productId) {
      if (createProductRes.isSuccess) {
        message.success("The product was created successfully !");
        form.resetFields();
      }
      if (createProductRes.isError) {
        if (Array.isArray(createProductRes.error.data.error)) {
          createProductRes.error.data.error.forEach((el) =>
            message.error(el.message)
          );
        } else {
          message.error(createProductRes.error.data.msg);
        }
      }
    } else {
      if (editProductRes.isSuccess) {
        message.success("The product was edited successfully !");
      }
      if (editProductRes.isError) {
        if (Array.isArray(editProductRes.error.data.error)) {
          editProductRes.error.data.error.forEach((el) =>
            message.error(el.message)
          );
        } else {
          message.error(editProductRes.error.data.msg);
        }
      }
    }
  }, [createProductRes.isLoading, editProductRes.isLoading]);

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
          name="imgs"
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
            maxCount={6}
            multiple={true}
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
        <Form.Item
          name="categories"
          rules={[{ required: true, message: "Please select categories!" }]}
          label="Loại sản phẩm"
        >
          <Select
            allowClear
            options={[
              { value: "da lieu", label: "Da Liễu" },
              { value: "cham soc be", label: "Chăm sóc bé" },
            ]}
          />
        </Form.Item>
        <FormItem
          name={"code"}
          label="Mã sản phẩm"
          rules={[
            { required: true, message: "Please enter the code !" },
            {
              pattern: new RegExp(/^[a-zA-Z0-9 ]+$/),
              message: "Only numbers and letters",
            },
          ]}
        >
          <Input />
        </FormItem>

        <FormItem
          name={"count"}
          label="Số lượng hàng"
          rules={[
            { required: true, message: "Please enter the count !" },
            { pattern: new RegExp(/^[0-9]*$/), message: "Only number here" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </FormItem>
        <FormItem
          name={"discount"}
          label="Giảm giá"
          rules={[
            { required: true, message: "Please enter the discount !" },
            { pattern: new RegExp(/^[0-9]*$/), message: "Only number here" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            addonBefore="%"
            min={0}
            max={100}
          />
        </FormItem>
        <FormItem
          name={"price"}
          label="Giá"
          rules={[
            { required: true, message: "Please enter the price !" },
            { pattern: new RegExp(/^[0-9]*$/), message: "Only number here" },
          ]}
        >
          <InputNumber
            addonBefore="VND"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            style={{ width: "100%" }}
          />
        </FormItem>

        <FormItem
          name={"size"}
          label="Kích cỡ"
          rules={[
            { required: true, message: "Please enter the size !" },
            { pattern: new RegExp(/^[0-9]*$/), message: "Only number here" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            addonAfter={
              <Select
                onChange={(v) => setValueAffSizeInput(v)}
                style={{ width: "80px" }}
                defaultValue={"ml"}
                options={[
                  { value: "ml", label: "ml" },
                  { value: "l", label: "l" },
                  { value: "gói", label: "gói" },
                  { value: "hộp", label: "hộp" },
                ]}
              />
            }
          />
        </FormItem>
        <FormItem
          name={"sold"}
          label="Đã bán"
          rules={[
            { required: true, message: "Please enter the sold !" },
            { pattern: new RegExp(/^[0-9]*$/), message: "Only number here" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </FormItem>
        <FormItem
          name={"desc"}
          label="Mô tả"
          rules={[{ required: true, message: "Please enter the desc !" }]}
        >
          <CkEdit
            onChange={onChangeEditor}
            onReady={(editor) => console.log(editor)}
            data={data ? data.desc : ""}
          />
        </FormItem>
        <FormItem>
          <Button
            style={{ width: "100%", background: "#7F1416", height: "37px" }}
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {productId ? "Sửa" : "Thêm"}
          </Button>
        </FormItem>
      </Form>
    </>
  );
}

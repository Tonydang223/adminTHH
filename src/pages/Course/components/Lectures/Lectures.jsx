import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Upload, message, Skeleton } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { getBase64 } from "../../../../utils/readFile";
import CkEdit from "../../../../components/CkEditor5/CkEdit";
import ModalImage from "../../../../components/Modals/ModalImage";
import { useParams } from "react-router-dom";
import {
  useGetLecturesOfCourseQuery,
  usePostLecturesMutation,
} from "../../course.service";
export default function Lectures() {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [dataDel, setDataDel] = useState([]);

  const { data, isFetching } = useGetLecturesOfCourseQuery(id, {
    skip: !id,
  });

  const savedData = !isFetching && data?.length > 0 ? data.map((item) => {
    return {
      ...item,
      videoIntro: item.videoIntro ? [item.videoIntro] : [],
    }
  }) :[]



  const [postLectures, setPostLecturesRes] = usePostLecturesMutation();

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
    fmData.append("upload_preset", "videolearns");
    fmData.append("api_key", process.env.REACT_APP_CLOUD_API_KEY_CLOUD);
    fmData.append("api_secret", process.env.REACT_APP_CLOUD_API_SECRET_CLOUD);

    try {
      if (file.size / 1024 / 1024 > 90) {
        onError("Files not larger than 90mb");
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
    let addDalles = [...e.items].concat(dataDel);
    if (addDalles.length > 0) {
      addDalles = addDalles.map((i) => {
        return {
          ...i,
          videoIntro: i.videoIntro && i.videoIntro.length > 0
            ? {
                uid: i.videoIntro[0].uid,
                url: i.videoIntro[0].response || i.videoIntro[0].url,
                name: i.videoIntro[0].name,
                status: i.videoIntro[0].status,
              }
            : {},
          course: id,
        };
      });
      await postLectures({ id: id, body: {items: addDalles} });
    } else {
      message.error("Ensure all fields is not empty or not data yet!");
    }


  };

  useEffect(() => {
    if (setPostLecturesRes.isSuccess) {
      message.success("The course was created successfully !");
    }
    if (setPostLecturesRes.isError) {
      if (Array.isArray(setPostLecturesRes.error.data.error)) {
        setPostLecturesRes.error.data.error.forEach((el) =>
          message.error(el.message)
        );
      } else {
        message.error(setPostLecturesRes.error.data.msg);
      }
    }
  }, [setPostLecturesRes.isLoading]);

  return (
    <>
      {isFetching ? (
        <Skeleton />
      ) : (
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          onFinish={handleSubmit}
          name="dynamic_form_complex"
          style={{ maxWidth: 600 }}
          autoComplete="off"
          layout="vertical"
          initialValues={{
            items: savedData,
          }}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
              >
                {fields.map((field, index) => {
                  return (
                    <Card
                      size="small"
                      title={`Bài học ${field.name + 1}`}
                      key={field.key}
                      extra={
                        <CloseOutlined
                          onClick={() => {
                            console.log("aaa");
                            if (form.getFieldValue("items")[index]?._id) {
                              setDataDel([
                                ...dataDel,
                                {
                                  isDel: true,
                                  _id: form.getFieldValue("items")[index]._id,
                                },
                              ]);
                            }
                            remove(field.name);
                          }}
                        />
                      }
                    >
                      <Form.Item {...field} name={[field.name, "_id"]}>
                        <Input disabled/>
                      </Form.Item>
                      <Form.Item
                        {...field}
                        label="Title"
                        name={[field.name, "title"]}
                      >
                        <Input placeholder="Tiều đề bào học" />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, "videoIntro"]}
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
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
                          accept={"video/*"}
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
                      </Form.Item>
                      <ModalImage
                        previewImage={previewImage}
                        previewOpen={previewOpen}
                        previewTitle={previewTitle}
                        handleCancel={handleCancel}
                        isVid={true}
                      />
                      <Form.Item
                        {...field}
                        name={[field.name, "desc"]}
                        label="Mô tả"
                        rules={[
                          {
                            required: true,
                            message: "Please enter the desc !",
                          },
                        ]}
                      >
                        <CkEdit
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            form.setFieldsValue({
                              items: {
                                [field.name]: { desc: data },
                              },
                            });
                          }}
                          data={form.getFieldValue("items")[index]?.desc}
                        />
                      </Form.Item>
                    </Card>
                  );
                })}
                <Button type="dashed" onClick={() => add()} block>
                  + Thêm bài học
                </Button>
              </div>
            )}
          </Form.List>
          <Form.Item>
            <Button
              style={{
                width: "600px",
                maxWidth: "600px",
                marginTop: "20px",
                background: "#7F1416",
                height: "37px",
              }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Lưu
            </Button>
          </Form.Item>
        </Form>
      )}
    </>
  );
}

import { Button, Form, Input, Upload, message, Select, InputNumber } from "antd";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons";
import ModalImage from "../../../../components/Modals/ModalImage"
import { getBase64 } from "../../../../utils/readFile"
import {useEffect, useState} from 'react';
import CkEdit from "../../../../components/CkEditor5/CkEdit"
import { useEditCourseMutation, useGetOneCourseQuery } from "../../course.service"
import {useParams, useNavigate} from 'react-router-dom';


const FormItem = Form.Item;


export default function EditCourse() {
  const [form] = Form.useForm();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const [valueAffSizeInput, setValueAffSizeInput] = useState("phút");
  
  const {id} = useParams();
  const navigate =useNavigate();

  const {data, isError, isFetching} = useGetOneCourseQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFetching && data) {
      const editData = { ...data, amount_time: Number(data.amount_time?.split(" ")[0]), thumbnail: [data.thumbnail] };
      form.setFieldsValue(editData);
    }
    if (id && isError) {
      navigate("/course");
      message.error('Sorry the course is not available!');
    }
  }, [data, form, isError, navigate, id, isFetching]);

  const [editCourse, editCourseRes] = useEditCourseMutation();


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
    fmData.append("upload_preset", "course");
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

  const onChangeEditor = (event, editor) => {
    const dataEditorDes = editor.getData();
    form.setFieldValue("desc", dataEditorDes);
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
      if(editedValues.thumbnail[0].status === 'error') {
        message.error("File img is fail! Try again")
      } else {
        editedValues = {
            ...editedValues,
            thumbnail: {
              uid: e.thumbnail[0].uid,
              url: e.thumbnail[0].response || e.thumbnail[0].url,
              name: e.thumbnail[0].name,
              status: e.thumbnail[0].status,
            },
            amount_time: String(editedValues.amount_time) + " " + valueAffSizeInput,

          };
          await editCourse({id: id, body: editedValues});
      }

    }
  };

  useEffect(() => {
    if (editCourseRes.isSuccess) {
        message.success("The course was edited successfully !");
      }
      if (editCourseRes.isError) {
        if (Array.isArray(editCourseRes.error.data.error)) {
            editCourseRes.error.data.error.forEach((el) =>
            message.error(el.message)
          );
        } else {
          message.error(editCourseRes.error.data.msg);
        }
      }
  }, [editCourseRes.isLoading])


  return (
    <>
      <Form
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
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
          name={"name"}
          label="Tên khoá học"
          rules={[{ required: true, message: "Please enter your name !" }]}
        >
          <Input
            placeholder="Name of the course"
          />
        </FormItem>
        <FormItem
          name={"instructor_by"}
          label="Tên giảng viên"
          rules={[{ required: true, message: "Please enter the instructor !" }]}
        >
          <Input
            placeholder="Instructor"
          />
        </FormItem>
        <Form.Item
          name="level"
          rules={[{ required: true, message: "Please select categories!" }]}
          label="Đối tượng"
        >
          <Select
            allowClear
            options={[
              { value: "Trẻ em", label: "Trẻ em" },
              { value: "Người trung niên", label: "Người trung niên" },
              { value: "Người già", label: "Người già" },
              { value: "Tất cả mọi đối tượng", label: "Tất cả mọi đối tượng" },
            ]}
          />
        </Form.Item>
        <FormItem
          name={"amount_time"}
          label="Thời lượng"
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
                defaultValue={"phút"}
                options={[
                  { value: "tháng", label: "tháng" },
                  { value: "tuần", label: "tuần" },
                  { value: "giờ", label: "giờ" },
                  { value: "phút", label: "phút" },
                ]}
              />
            }
          />
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
            Lưu
          </Button>
        </FormItem>
      </Form>
    </>
  );
}

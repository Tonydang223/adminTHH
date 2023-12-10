import { Form, Input, Button, message } from "antd";
import "./index.scss";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import logoLogin from "../../../assets/logoMainLogin.png";
import { useLoginMutation, useLogoutMutation } from "../auth.service";
import { useEffect,  } from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'

const FormItem = Form.Item;

export default function Login() {
  const [login, loginResults] = useLoginMutation();
  const [logout, {isSuccess, isLoading}] = useLogoutMutation();
  const navigate = useNavigate();
  const {token} = useSelector(state => state.user);


  const handleSubmit = async (e) => {
    await login(e);
  };


  useEffect(() => {
    if (loginResults.isSuccess) {
      if (loginResults.data?.user?.role === 1) {
        navigate("/");
        message.success("Đăng nhập thành công !");
      } else {
        message.error("Xin lỗi bạn không phải Admin !");
        logout();
      }
    }

    if (loginResults.isError) {
      if (Array.isArray(loginResults.error.data.error)) {
        loginResults.error.data.error.forEach((el) =>
          message.error(el.message)
        );
      } else {
        message.error(loginResults.error.data.msg);
      }
    }


  }, [loginResults.isLoading]);

  useEffect(() => {
    if(token) {
        navigate('/');
    }
    if(isSuccess) {
      navigate('/login');
    }
  }, [token, isLoading])
  return (
    <div className="wrapperForm">
      <div className="boxForm">
        <div className="logo-login">
          <img src={logoLogin} alt="Logo Login Admin Nam Y Duong" />
        </div>
        <Form
          onFinish={handleSubmit}
          className="login-form"
          initialValues={{ username: "", password: "" }}
        >
          <FormItem
            name={"email"}
            rules={[
              { required: true, message: "Please enter your username !" },
            ]}
          >
            <Input
              placeholder="Email"
              prefix={<FaRegUser color="#ACADA8" />}
            />
          </FormItem>
          <FormItem
            name={"password"}
            rules={[
              { required: true, message: "Please enter your password !" },
            ]}
          >
            <Input.Password
              type="password"
              placeholder="Password"
              prefix={<RiLockPasswordLine color="#ACADA8" />}
            />
          </FormItem>
          <FormItem>
            <Button
              style={{ width: "100%", background: "#7F1416", height: "37px" }}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              ĐĂNG NHẬP
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  );
}

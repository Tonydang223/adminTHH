import {
  Avatar,
  Breadcrumb,
  Button,
  Layout,
  Menu,
  Space,
  Dropdown,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { IoHome } from "react-icons/io5";
import { FaUser, FaStoreAlt } from "react-icons/fa";
import { MdPostAdd } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import styled from "@emotion/styled";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import LogoAdmin from "../../assets/logoAdmin.png";
import "./index.scss";
import { useSelector } from "react-redux";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline } from "react-icons/io5";
import { useLogoutMutation } from "../../pages/Auth/auth.service";
const { Text } = Typography;
const { Content, Header, Sider } = Layout;

export default function LayoutDB(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [current, setCurrent] = useState(location.pathname);
  const { user } = useSelector((state) => state.user);

  const [, setCurrentProfileSubMeu] = useState("subMenuProfile");

  const [logout, { isSuccess, isLoading }] = useLogoutMutation();

  useEffect(() => {
    setCurrent(`/${location.pathname.split('/')[1]}`);
  }, [location.pathname]);

  const setCurrentMenu = (e) => {
    navigate(e.key);
  };

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isLoading]);

  const setCurSubMeuProfile = (e) => {
    setCurrentProfileSubMeu(e.key);
    if (e.key === "/profile") {
      navigate(e.key);
    } else if (e.key === "/logout") {
      setTimeout(async () => {
        await logout();
      }, 800);
    }
  };

  const IconProfile = () => (
    <Space style={{ marginRight: "13px" }}>
      {user?.thumbnail?.url ? (
        <Avatar
          style={{
            backgroundColor: user?.thumbnail?.url ? "#fff" : "#7F1416",
            borderRadius: "5px",
          }}
          shape="square"
          src={user?.thumbnail ? user?.thumbnail?.url : ""}
        />
      ) : (
        <Avatar
          style={{ backgroundColor: "#7F1416", borderRadius: "5px" }}
          shape="square"
          icon={<UserOutlined />}
        />
      )}
    </Space>
  );

  const CustomMenu = styled(Menu)`
    && .ant-menu-item-selected {
      background-color: #fff;
      color: #000000 !important;
    }

    && .ant-menu-item {
      color: #fff;
    }

    && .ant-menu-item:not(.ant-menu-item-selected):hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
    }
  `;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        style={{ backgroundColor: "#7F1416" }}
        collapsible
        collapsed={collapsed}
        breakpoint={"lg"}
        className="sider-left"
      >
        <div className="demo-logo">
          <img src={LogoAdmin} alt="Logo Admin Nam Y Duong" />
        </div>
        <CustomMenu
          style={{ backgroundColor: "#7F1416" }}
          mode="inline"
          onClick={setCurrentMenu}
          selectedKeys={[current]}
          items={[
            {
              label: "Home",
              icon: <IoHome />,
              key: "/",
            },
            {
              label: "User",
              icon: <FaUser />,
              key: "/user",
            },
            {
              label: "Product",
              icon: <FaStoreAlt />,
              key: "/product",
            },
            {
              label: "Post",
              icon: <MdPostAdd />,
              key: "/post",
            },
            {
              label: "Course",
              icon: <IoBookSharp />,
              key: "/course",
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            menu={{
              items: [
                {
                  label: "Trang Cá Nhân",
                  key: "/profile",
                  icon: <CgProfile />,
                },
                {
                  label: "Đăng xuất",
                  key: "/logout",
                  icon: <IoExitOutline />,
                },
              ],
              onClick: setCurSubMeuProfile,
            }}
          >
            <div>
              <IconProfile />
              <Text strong style={{ marginRight: "10px" }}>
                {user?.firstName}
              </Text>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: "0 16px", overflow: "initial" }}>
          <Breadcrumb
            items={[
              {
                title:
                  `${current.charAt(1).toUpperCase()}` +
                  `${current.substring(2, current.length)}`,
              },
            ]}
            style={{ margin: "16px 0" }}
          />
          <div style={{ padding: 24, background: "#fff" }}>
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

LayoutDB.propTypes = {
  children: PropTypes.node.isRequired,
};

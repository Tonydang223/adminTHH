import { Routes, Route } from "react-router-dom";
import Main from "./Home/Main";
import MainProduct from "./Product/MainProduct";
import MainPost from "./Posts/MainPost";
import MainUser from "./User/MainUser";
import Login from "./Auth/Login/Login";
import RequiredRoute from "../components/ProtectedRoutes/RequiredRoute";
import Profile from "../components/Profile/Profile";
import PageNotFound from "../components/PageNotFound";
import ModalFirm from "../components/Modals/ModalFirm";
import AddProduct from "./Product/components/AddProduct";
import Courses from "./Course/Courses";
import DetailCourse from "./Course/\bDetailCourse";
import AddCourse from "./Course/components/ActionCourse/AddCourse";
import MainCourseLayout from "./Course/MainCourseLayout";
import MainProductLayout from "./Product/MainProductLayout";
import MainLayoutPost from "./Posts/MainLayoutPost";
import AddPost from "./Posts/component/AddPost";
import LayoutCore from "./LayoutCore"

export default function MainPages() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutCore />}>
          <Route element={<RequiredRoute />}>
            <Route index element={<Main />} />

            <Route path="course" element={<MainCourseLayout />}>
              <Route index element={<Courses />} />
              <Route path="add" element={<AddCourse />} />
              <Route path="detail/:id" element={<DetailCourse />} />
            </Route>

            <Route path="product" element={<MainProductLayout />}>
              <Route index element={<MainProduct />} />
              <Route path="add" element={<AddProduct />} />
              <Route path="add/:productId" element={<AddProduct />} />
            </Route>

            <Route path="post" element={<MainLayoutPost />}>
              <Route index element={<MainPost />} />
              <Route path="add" element={<AddPost />} />
              <Route path="add/:postId" element={<AddPost />} />
            </Route>
            <Route path="user" element={<MainUser />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ModalFirm />
    </>
  );
}

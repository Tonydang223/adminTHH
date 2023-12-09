import LayoutDB from '../../components/LayoutDashBoard/LayoutDB'
import { Outlet } from "react-router-dom";

export default function MainLayoutPost() {
  return (
    <LayoutDB>
       <Outlet />
    </LayoutDB>
  )
}

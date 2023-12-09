import LayoutDB from '../../components/LayoutDashBoard/LayoutDB'
import {Outlet} from 'react-router-dom'

export default function MainCourseLayout() {
  return (
    <LayoutDB>
        <Outlet />
    </LayoutDB>
  )
}

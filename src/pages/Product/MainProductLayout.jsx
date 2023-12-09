import React from 'react'
import LayoutDB from '../../components/LayoutDashBoard/LayoutDB'
import { Outlet } from "react-router-dom";

export default function MainProductLayout() {
  return (
    <LayoutDB>
       <Outlet />
    </LayoutDB>
  )
}

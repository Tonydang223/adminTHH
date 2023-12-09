import { Tabs } from "antd";
import { FaBookOpen } from "react-icons/fa";
import { TbBrandPagekit } from "react-icons/tb";
import Lectures from './components/Lectures/Lectures'
import EditCourse from './components/ActionCourse/EditCourse'

export default function DetailCourse() {
    const items = [
        {
          key: "add_course",
          label: (
            <span>
              <FaBookOpen />
              Course
            </span>
          ),
          children: <EditCourse />
        },
        {
          key: "lecture",
          label: (
            <span>
              <TbBrandPagekit />
              Lectures
            </span>
          ),
          children: <Lectures />
        },
      ];
  return (
        <Tabs defaultActiveKey={`add_course`} items={items}  />
  )
}

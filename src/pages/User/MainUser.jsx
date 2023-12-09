import LayoutDB from "../../components/LayoutDashBoard/LayoutDB";
import { Table, Input, Skeleton } from "antd";
import moment from "moment";
import { useState } from "react";
import { useGetUsersQuery } from "./user.service";

const { Search } = Input;

export default function MainUser() {
  const [searchFilter, setSearchFilter] = useState("");
  const { data, isFetching } = useGetUsersQuery();


  const onSearchData = (data) => {
    setSearchFilter(data);
  };

  const onChangeSearch = (e) => {
    if (e.target.value === "") setSearchFilter("");
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      filteredValue: [searchFilter],
      onFilter: (value, record) => {
        return String(record.firstName)
          .toLowerCase()
          .includes(value.toLowerCase());
      },
    },
    {
      title: "Avatar",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (imgs) => (
        <>
           {
            Object.keys(imgs).length < 1 ? (<span>None</span>) :(
              <img src={imgs.url} alt="img" width="50px" />
            )
           }
        </>
      ),
      responsive: ["lg"],
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Sign Up At",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (time) => (
        <>
          <span>{moment(new Date(time)).format("DD/MM/YYYY")}</span>
        </>
      ),
    },
  ];

  const savedData =
  !isFetching && data?.length > 0
    ? data
        .map((i) => {
          return {
            ...i,
            key: i._id,
            thumbnail: !i.thumbnail ? {} : i.thumbnail,
          };
        })
    : [];


  return (
    <LayoutDB>
      {isFetching ? (
        <Skeleton />
      ) : (
        <>
          <div className="flex-row">
            <div className="flex-row">
              <Search
                placeholder="Tìm kiếm người dùng..."
                onSearch={onSearchData}
                enterButton
                onChange={onChangeSearch}
              />
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={savedData}
            pagination={{
              total: savedData.length,
              pageSize: 5,
              hideOnSinglePage: true,
            }}
          />
        </>
      )}
    </LayoutDB>
  );
}

import { useEffect, useState } from "react";
import { closeGlobal, showGlobal } from "../../components/Modals/ModalFirm";
import {
  Space,
  Table,
  Button,
  Typography,
  Input,
  Skeleton,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  useDeleteCourseMutation,
  useDeleteCourseRestoreBackMutation,
  useDeleteCourseRestoreMutation,
  useGetCoursesQuery,
} from "./course.service";
const { Search } = Input;
const { Text } = Typography;

export default function Courses() {
  const navigate = useNavigate();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [recycles, setRecycles] = useState(false);
  const [loading, setLoading] = useState({
    delSel: false,
    reSel: false,
  });

  const onSearchData = (data) => {
    setSearchFilter(data);
  };

  const onChangeSearch = (e) => {
    if (e.target.value === "") setSearchFilter("");
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const { data, isFetching } = useGetCoursesQuery();

  const [deleteCourse, deleteCourseRes] = useDeleteCourseMutation();

  const [deleteCourseRestoreBack] = useDeleteCourseRestoreBackMutation();
  const [deleteCourseRestore] = useDeleteCourseRestoreMutation();

  const deleteAll = async () => {
    setLoading({
      ...loading,
      delSel: true,
    });

    setTimeout(async () => {
      closeGlobal();
      setSelectedRowKeys([]);

      if (recycles) {
        await deleteCourse({ ids: selectedRowKeys });
      } else {
        await deleteCourseRestore({ ids: selectedRowKeys });
      }

      setLoading({
        ...loading,
        delSel: false,
      });
    }, 1200);
  };

  const restoreAll = async () => {
    setLoading({
      ...loading,
      reSel: true,
    });

    setTimeout(async () => {
      setSelectedRowKeys([]);

      await deleteCourseRestoreBack({ ids: selectedRowKeys });

      setLoading({
        ...loading,
        reSel: false,
      });
    }, 1200);
  };

  const savedData =
    !isFetching && data?.length > 0
      ? data
          .filter((i) => (recycles ? i.isDeleted : !i.isDeleted))
          .map((i) => {
            return {
              ...i,
              key: i._id,
            };
          })
      : [];

  useEffect(() => {
    if (deleteCourseRes.isSuccess) {
      message.success("The course was deleted successfully !");
    }
    if (deleteCourseRes.isError) {
      if (Array.isArray(deleteCourseRes.error.data.error)) {
        deleteCourseRes.error.data.error.forEach((el) =>
          message.error(el.message)
        );
      } else {
        message.error(deleteCourseRes.error.data.msg);
      }
    }
  }, [deleteCourseRes.isLoading]);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filteredValue: [searchFilter],
      onFilter: (value, record) => {
        return (
          String(record.name).toLowerCase().includes(value.toLowerCase()) ||
          String(record.instructor_by)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.level).toLowerCase().includes(value.toLowerCase()) ||
          String(record.amount_time).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Thumnals",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (imgs) => (
        <>
          <img src={imgs.url} alt="img" width="50px" />
        </>
      ),
      responsive: ["lg"],
    },
    {
      title: "Instructor",
      key: "instructor_by",
      dataIndex: "instructor_by",
    },
    {
      title: "Level",
      key: "level",
      dataIndex: "level",
    },
    {
      title: "Amount Time",
      key: "amount_time",
      dataIndex: "amount_time",
    },
    {
      title: "Actions",
      key: "action",
      render: (course) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              showGlobal({
                body: <Text>Bạn chắc có muốn xoá sản phẩm này không ?</Text>,
                onOk: () => {
                  const dt = [course._id];
                  closeGlobal();
                  setTimeout(async () => {
                    if (recycles) {
                      console.log("xoa that");
                      await deleteCourse({ ids: dt });
                    } else {
                      await deleteCourseRestore({ ids: dt });
                    }
                    setSelectedRowKeys([]);
                  }, 1000);
                },
                onCancel: () => {
                  closeGlobal();
                },
              });
            }}
            danger
          >
            Delete
          </Button>
          <Button
            type="primary"
            onClick={async () => {
              if (recycles) {
                console.log("restore");
                const dt = [course._id];
                await deleteCourseRestoreBack({ ids: dt });
                setSelectedRowKeys([]);
              } else {
                navigate(`/course/detail/${course._id}`);
              }
            }}
          >
            {recycles ? "Restore" : "Details"}
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <>
      {isFetching ? (
        <Skeleton />
      ) : (
        <div>
          <div className="actionsMoreWrap flex-row">
            <div>
              <Button
                type="primary"
                onClick={() => {
                  showGlobal({
                    body: (
                      <Text>Bạn chắc có muốn xoá các sản phẩm này không ?</Text>
                    ),
                    onOk: deleteAll,
                    onCancel: () => {
                      closeGlobal();
                    },
                  });
                }}
                disabled={!hasSelected}
                loading={loading.delSel}
              >
                Xoá đã chọn
              </Button>

              {recycles && (
                <Button
                  type="primary"
                  disabled={!hasSelected}
                  loading={loading.reSel}
                  onClick={restoreAll}
                  style={{ marginLeft: "20px" }}
                >
                  Restore đã chọn
                </Button>
              )}
              <Button
                onClick={() => setRecycles(!recycles)}
                style={{ marginLeft: "20px" }}
                type="primary"
              >
                {!recycles ? "Thùng rác" : "Các sản phẩm"}
              </Button>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: "12px",
                }}
              >
                {hasSelected
                  ? `Đã chọn ${selectedRowKeys.length} sản phẩm`
                  : ""}
              </span>
            </div>

            <div className="flex-row">
              <Search
                placeholder="Tìm kiếm khoá học..."
                onSearch={onSearchData}
                enterButton
                onChange={onChangeSearch}
              />
              <Button
                onClick={() => navigate("/course/add")}
                type="primary"
                style={{ marginLeft: "15px" }}
              >
                Thêm sản phẩm
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            dataSource={savedData}
            pagination={{
              total: savedData.length,
              pageSize: 5,
              hideOnSinglePage: true,
            }}
          />
        </div>
      )}
    </>
  );
}

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
  useDeletePostMutation,
  useDeletePostRestoreBackMutation,
  useDeletePostRestoreMutation,
  useGetPostsQuery,
} from "./post.service";
import moment from 'moment';

const { Search } = Input;
const { Text } = Typography;

export default function MainPost() {
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

  const { data, isFetching } = useGetPostsQuery();

  const [deletePost, deletePostRes] = useDeletePostMutation();

  const [deletePostRestoreBack] = useDeletePostRestoreBackMutation();
  const [deletePostRestore] = useDeletePostRestoreMutation();

  const deleteAll = async () => {
    setLoading({
      ...loading,
      delSel: true,
    });

    setTimeout(async () => {
      closeGlobal();
      setSelectedRowKeys([]);

      if (recycles) {
        await deletePost({ ids: selectedRowKeys });
      } else {
        await deletePostRestore({ ids: selectedRowKeys });
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

      await deletePostRestoreBack({ ids: selectedRowKeys });

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
    if (deletePostRes.isSuccess) {
      message.success("The post was deleted successfully !");
    }
    if (deletePostRes.isError) {
      if (Array.isArray(deletePostRes.error.data.error)) {
        deletePostRes.error.data.error.forEach((el) =>
          message.error(el.message)
        );
      } else {
        message.error(deletePostRes.error.data.msg);
      }
    }
  }, [deletePostRes.isLoading]);
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      filteredValue: [searchFilter],
      onFilter: (value, record) => {
        return String(record.title).toLowerCase().includes(value.toLowerCase());
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
      title: "Created Time",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (time) => (
        <>
          <span>{moment(new Date(time)).format('DD/MM/YYYY')}</span>
        </>
      )
    },
    {
      title: "Actions",
      key: "action",
      render: (post) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              showGlobal({
                body: <Text>Bạn chắc có muốn xoá sản phẩm này không ?</Text>,
                onOk: () => {
                  const dt = [post._id];
                  closeGlobal();
                  setTimeout(async () => {
                    if (recycles) {
                      console.log("xoa that");
                      await deletePost({ ids: dt });
                    } else {
                      await deletePostRestore({ ids: dt });
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
                const dt = [post._id];
                await deletePostRestoreBack({ ids: dt });
                setSelectedRowKeys([]);
              } else {
                navigate(`/admin/post/add/${post._id}`);
              }
            }}
          >
            {recycles ? "Restore" : "Edit"}
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
                placeholder="Tìm kiếm bài viết..."
                onSearch={onSearchData}
                enterButton
                onChange={onChangeSearch}
              />
              <Button
                onClick={() => navigate("/admin/post/add")}
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

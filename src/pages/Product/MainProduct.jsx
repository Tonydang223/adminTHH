import { useEffect, useState } from "react";
import { Space, Table, Button, Input, Typography, Skeleton, message } from "antd";
import "./product.scss";
import { closeGlobal, showGlobal } from "../../components/Modals/ModalFirm";
import { useNavigate } from "react-router-dom";
import {
  useDeleteProductMutation,
  useDeleteProductRestoreBackMutation,
  useDeleteProductRestoreMutation,
  useGetProductQuery,
} from "./product.service";
const { Text } = Typography;
const { Search } = Input;
export default function MainProduct() {
  const [searchFilter, setSearchFilter] = useState("");
  const navigate = useNavigate();

  const onSearchData = (data) => {
    setSearchFilter(data);
  };
  const onChangeSearch = (e) => {
    if (e.target.value === "") setSearchFilter("");
  };

  const { data, isFetching } = useGetProductQuery();

  const [deleteProductRestore, deleteProductRestoreRes] =
    useDeleteProductRestoreMutation();
  const [deleteProductRestoreBack, deleteProductRestoreBackRes] = useDeleteProductRestoreBackMutation()
  const [deleteProduct, deleteProductRes] = useDeleteProductMutation();

  // select del all

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [recycles, setRecycles] = useState(false);

  const [loading, setLoading] = useState({
    delSel: false,
    reSel: false,
  });
  const start = () => {
    setLoading({
      ...loading,
      delSel: true,
    });
    closeGlobal();
    // ajax request after empty completing
    setTimeout(async () => {
      if(recycles) {
        await deleteProduct({ ids: selectedRowKeys })
      } else {
        await deleteProductRestore({ ids: selectedRowKeys });
      }
      setSelectedRowKeys([]);
      setLoading({
        ...loading,
        delSel: false,
      });    
    }, 1000);
  };

  const startRestoreSelected = () => {
    setLoading({
      ...loading,
      reSel: true,
    });
    setTimeout(async () => {
      await deleteProductRestoreBack({ ids: selectedRowKeys });
      setSelectedRowKeys([]);
      setLoading({
        ...loading,
        reSel: false,
      });
    }, 1000);
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const savedData =
    !isFetching && data.length > 0
      ? data
          .filter((i) => (recycles ? i.isDeleted : !i.isDeleted))
          .map((i) => {
            return {
              ...i,
              key: i._id,
            };
          })
      : [];


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      filteredValue: [searchFilter],
      onFilter: (value, record) => {
        return (
          String(record.title).toLowerCase().includes(value.toLowerCase()) ||
          String(record.categories)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.code).toLowerCase().includes(value.toLowerCase()) ||
          String(record.price).toLowerCase().includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Thumnals",
      dataIndex: "imgs",
      key: "imgs",
      render: (imgs) => (
        <>
          <img src={imgs[0].url} alt="img" width="50px" />
        </>
      ),
      responsive: ["lg"],
    },
    {
      title: "Categories",
      key: "categories",
      dataIndex: "categories",
    },
    {
      title: "Code",
      key: "code",
      dataIndex: "code",
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
    },
    {
      title: "Stock",
      key: "count",
      dataIndex: "count",
    },
    {
      title: "Actions",
      key: "action",
      render: (product) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              showGlobal({
                body: <Text>Bạn chắc có muốn xoá sản phẩm này không ?</Text>,
                onOk: () => {
                  const dt = [product._id];
                  closeGlobal();
                  setTimeout(async () => {
                    if(recycles) {
                      await deleteProduct({ids: dt});
                    } else {
                      await deleteProductRestore({ ids: dt });
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
                const dt = [product._id];
                await deleteProductRestoreBack({ ids: dt });
                setSelectedRowKeys([]);
              } else {
                navigate(`/admin/product/add/${product._id}`);
              }
            }}
          >
            {recycles ? "Restore" : "Edit"}
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    if (deleteProductRes.isSuccess) {
      message.success("The product was deleted successfully !");
    }
    if (deleteProductRes.isError) {
      if (Array.isArray(deleteProductRes.error.data.error)) {
        deleteProductRes.error.data.error.forEach((el) =>
          message.error(el.message)
        );
      } else {
        message.error(deleteProductRes.error.data.msg);
      }
    }
  }, [deleteProductRes.isLoading]);

  return (
    <>
      {isFetching || deleteProductRestoreRes.isLoading || deleteProductRestoreBackRes.isLoading || deleteProductRes.isLoading ? (
        <Skeleton />
      ) : (
        <>
          <div className="actionsMoreWrap flex-row">
            <div>
              <Button
                type="primary"
                onClick={() => {
                  showGlobal({
                    body: (
                      <Text>Bạn chắc có muốn xoá các sản phẩm này không ?</Text>
                    ),
                    onOk: start,
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
                  onClick={startRestoreSelected}
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
                placeholder="Tìm kiếm sản phẩm..."
                onSearch={onSearchData}
                enterButton
                onChange={onChangeSearch}
              />
              {!recycles && (
                <Button
                  onClick={() => navigate("/admin/product/add")}
                  type="primary"
                  style={{ marginLeft: "15px" }}
                >
                  Thêm sản phẩm
                </Button>
              )}
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
        </>
      )}
    </>
  );
}

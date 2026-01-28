import React, { useMemo, useState, useEffect } from "react";
import { Space, Table, Button, Form, message, Input, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { TableProps, TablePaginationConfig } from "antd";
import { ReactTransliterate } from "react-transliterate";
import { useNavigate, useLocation } from "react-router-dom";
import CommonModal from "../common/CommonModal";
import ConfirmModal from "../common/ConfirmModal";
import TransliterateSearch from "./TransliterateSearch";
import Header from "./Header";
import { IoMdArrowRoundBack } from "react-icons/io";
import Loader from "../common/Loader";
import personalbheeApiService from "../services/personalbheeApiService";
import Footer from "../google adsense/Footer";


interface DataType {
  key: string;
  cast: string;
  name: string;
  fathername: string;
  address: string;
  aavta: number;
  uparnet: number;
  baheeType?: string;
  baheeTypeName?: string;
  headerName?: string;
}

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
}

interface LocationState {
  baheeType: string;
  baheeTypeName: string;
  fromThirdSelector?: boolean;
}

const ViewEntriesByType: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  const baheeType = state?.baheeType || '';
  const baheeTypeName = state?.baheeTypeName || '';
  const fromThirdSelector = state?.fromThirdSelector || false;

  // State
  const [allData, setAllData] = useState<DataType[]>([]);
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [lockedKeys, setLockedKeys] = useState<Record<string, boolean>>({});
  const [baheeDetails, setBaheeDetails] = useState<BaheeDetails[]>([]);
  const [selectedSpecificBahee, setSelectedSpecificBahee] = useState<BaheeDetails | null>(null);
  
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<DataType | null>(null);
  const [form] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState({ open: false, record: null as DataType | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewModal, setViewModal] = useState({ open: false, record: null as DataType | null });


  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showQuickJumper: true,
  });

  // Load data from API
  useEffect(() => {
    loadAllData();
  }, [baheeType]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const entriesResponse = await personalbheeApiService.getPersonalAllBaheeEntries();

      if (entriesResponse.success && entriesResponse.data) {
        const allEntries = entriesResponse.data || [];
        const uniqueTypes = [...new Set(allEntries.map((e: any) => e.baheeType))];
        
        const typeFilteredEntries = allEntries.filter((entry: any) => {
          const entryType = entry.baheeType?.toLowerCase();
          const searchType = baheeType.toLowerCase();
          const matches = entryType === searchType;
          
          return matches;
        });
  
        if (typeFilteredEntries.length === 0) {
          console.error('❌ NO ENTRIES FOUND!');
          console.error('❌ You are searching for:', baheeType);
          console.error('❌ But database has:', uniqueTypes);
          console.error('❌ FIX: Update your PersonalEntryForm to save correct baheeType');
        }
  
        const transformedData: DataType[] = typeFilteredEntries.map((entry: any, index: number) => ({
          key: entry._id || entry.id || `entry_${index}`,

          cast: entry.caste || '',
          name: entry.name || '',
          fathername: entry.fatherName || '',
          address: entry.villageName || '',
          aavta: Number(entry.income || 0),
          uparnet: Number(entry.amount || 0),

          baheeType: entry.baheeType || baheeType,
          baheeTypeName: entry.baheeTypeName || baheeTypeName,
          headerName: entry.headerName || '',
        }));

        setAllData(transformedData);
        setFilteredData(transformedData);
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      message.error('डेटा लोड करने में समस्या हुई');
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    let filtered = allData;

    if (selectedSpecificBahee && !fromThirdSelector) {
      filtered = allData.filter((r) => 
        r.headerName === selectedSpecificBahee.name
      );
    }

    if (searchText.trim() !== "") {
      const q = searchText.trim().toLowerCase();
      filtered = filtered.filter((r) =>
        r.cast?.toLowerCase().includes(q) ||
        r.name?.toLowerCase().includes(q) ||
        r.fathername?.toLowerCase().includes(q) ||
        r.address?.toLowerCase().includes(q) ||
        r.aavta.toString().includes(q) ||
        r.uparnet.toString().includes(q)
      );
    }

    setFilteredData(filtered);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [allData, selectedSpecificBahee, searchText, fromThirdSelector]);

  const handleSearch = (value: string) => setSearchText(value);
  const handleSearchChange = (value: string) => setSearchText(value);
  const handleClearSearch = () => setSearchText("");

  const handleGoBack = () => navigate('/bahee');


const handleAddEntries = () => {
  
  let navigationState;
  
  if (selectedSpecificBahee) {
    navigationState = {
      baheeType: baheeType,
      baheeTypeName: baheeTypeName,
      existingBaheeData: selectedSpecificBahee,
      fromThirdSelector: fromThirdSelector,
    };
  } else if (baheeDetails && baheeDetails.length > 0) {
    const firstBahee = baheeDetails[0];
    navigationState = {
      baheeType: firstBahee.baheeType,
      baheeTypeName: firstBahee.baheeTypeName,
      existingBaheeData: firstBahee,
      fromThirdSelector: fromThirdSelector,
    };
  } else {
    const tempBaheeDetails = {
      id: `temp-${Date.now()}`,
      baheeType: baheeType,
      baheeTypeName: baheeTypeName,
      name: baheeTypeName,
      date: new Date().toISOString(),
      tithi: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    navigationState = {
      baheeType: baheeType,
      baheeTypeName: baheeTypeName,
      existingBaheeData: tempBaheeDetails,
      fromThirdSelector: fromThirdSelector,
    };
  }
  
  
  navigate("/personal-bahee", {
    state: navigationState
  });
};

  // Edit entry
  const openEdit = (record: DataType) => {
    if (lockedKeys[record.key]) {
      message.warning("यह प्रविष्टि लॉक है");
      return;
    }
    
    setCurrent(record);
    setEditOpen(true);
    form.setFieldsValue({
      cast: record.cast,
      name: record.name,
      fathername: record.fathername,
      address: record.address,
      aavta: record.aavta,
      uparnet: record.uparnet,
    });
  };

const saveEdit = async () => {
  try {
    const values = await form.validateFields();

    if (current) {
      const updateData = {
        caste: values.cast,
        name: values.name,
        fatherName: values.fathername,
        villageName: values.address,
        income: Number(values.aavta || 0),
        amount: Number(values.uparnet || 0),
      };

      const response = await personalbheeApiService.personalUpdateBaheeEntry(
        current.key, 
        updateData
      );

      if (response.success) {
        message.success('Entry successfully updated!');
        setEditOpen(false);
        setCurrent(null);
        form.resetFields();
        loadAllData();
      }
    }
  } catch (error: any) {
    console.error('❌ Edit Error:', error);
    message.error('संपादन में समस्या हुई');
  }
};

  // Delete entry
  const openDeleteModal = (record: DataType) => {
    if (lockedKeys[record.key]) {
      message.warning("यह प्रविष्टि लॉक है");
      return;
    }
    setDeleteModal({ open: true, record });
  };

  const handleDeleteConfirm = async () => {

    if (!deleteModal.record) return;
    setDeleteLoading(true);
    
    try {
      const response = await personalbheeApiService.personalDeleteBaheeEntry(deleteModal.record.key);
      
      if (response.success) {
        message.success('Entry successfully deleted!');
        setDeleteModal({ open: false, record: null });
        loadAllData();
      } else {
        message.error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      message.error('डिलीट में समस्या हुई');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModal({ open: false, record: null });

  const openViewModal = (record: DataType) => setViewModal({ open: true, record });
  const handleViewCancel = () => setViewModal({ open: false, record: null });

  const highlightSearchText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 font-medium">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Table columns
  const columns: TableProps<DataType>["columns"] = useMemo(
    () => [
      {
        title: "S.NO",
        dataIndex: "sno",
        key: "sno",
        width: 80,
        align: "center",
        render: (_text, _record, index) => {
          const pageSize = pagination.pageSize || 10;
          const current = pagination.current || 1;
          return (current - 1) * pageSize + index + 1;
        },
      },
      {
        title: "जाति",
        dataIndex: "cast",
        key: "cast",
        width: 120,
        render: (text) => (
          <span className="capitalize">{highlightSearchText(text, searchText)}</span>
        ),
      },
      {
        title: "नाम",
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (text) => highlightSearchText(text, searchText),
      },
      {
        title: "पिता का नाम",
        dataIndex: "fathername",
        key: "fathername",
        width: 150,
        render: (text) => highlightSearchText(text, searchText),
      },
      {
        title: "गाँव का नाम",
        dataIndex: "address",
        key: "address",
        width: 200,
        render: (text) => highlightSearchText(text, searchText),
      },
      {
        title: "आवता",
        dataIndex: "aavta",
        key: "aavta",
        width: 120,
        align: "right",
        render: (value) =>
          highlightSearchText(`₹${(value ?? 0).toLocaleString()}`, searchText),
      },
      {
        title: "ऊपर नेत",
        dataIndex: "uparnet",
        key: "uparnet",
        width: 120,
        align: "right",
        render: (value, record) => {
          if (record.baheeType === "anya" && Number(value) === 0) {
            return (
              <span className="text-xs">
                ₹0 <br />
              </span>
            );
          }
          return highlightSearchText(`₹${(value ?? 0).toLocaleString()}`, searchText);
        },
      },
      {
        title: "कार्य",
        key: "action",
        width: 200,
        align: "center",
        render: (_, record) => {
          const isLocked = !!lockedKeys[record.key];
          return (
            <Space size="small">
              <Tooltip title={isLocked ? "Locked: view only" : "बही का विवरण देखें"}>
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  size="small"
                  onClick={() => openViewModal(record)}
                  className="bg-green-500 hover:bg-green-600"
                />
              </Tooltip>

              <Tooltip title={isLocked ? "Locked: संपादन निष्क्रिय" : "संपादित करें"}>
                <span>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openEdit(record)}
                    className={
                      isLocked
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                    disabled={isLocked}
                  />
                </span>
              </Tooltip>

              <Tooltip title={isLocked ? "Locked: हटाना निष्क्रिय" : "हटाएं"}>
                <span>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => openDeleteModal(record)}
                    disabled={isLocked}
                  />
                </span>
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [searchText, pagination.current, pagination.pageSize, lockedKeys]
  );

  // Current page slice
  const currentSlice = useMemo(() => {
    const current = pagination.current ?? 1;
    const size = pagination.pageSize ?? 10;
    const start = (current - 1) * size;
    const end = start + size;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.current, pagination.pageSize]);

  // Page totals
  const { pageAavta, pageUpar, pageTotal } = useMemo(() => {
    const pageAavta = currentSlice.reduce((sum, r) => sum + (Number(r.aavta) || 0), 0);
    const pageUpar = currentSlice.reduce((sum, r) => sum + (Number(r.uparnet) || 0), 0);
    return { pageAavta, pageUpar, pageTotal: pageAavta + pageUpar };
  }, [currentSlice]);

  // Grand totals
  const { totalAavta, totalUpar, grandTotal } = useMemo(() => {
    const totalAavta = filteredData.reduce((sum, r) => sum + (Number(r.aavta) || 0), 0);
    const totalUpar = filteredData.reduce((sum, r) => sum + (Number(r.uparnet) || 0), 0);
    return { totalAavta, totalUpar, grandTotal: totalAavta + totalUpar };
  }, [filteredData]);

  const onChange: TableProps<DataType>["onChange"] = (p) => {
    setPagination((prev) => ({ ...prev, current: p.current, pageSize: p.pageSize }));
  };

  if (loading) {
    return (
      <Loader
        size="large"
        text="Loading..."
        fullScreen={true}
        colors={["#32cd32", "#327fcd", "#cd32cd", "#cd8032"]}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4">
          {/* Header */}
          <div className="mb-6">
            <Header />
          </div>

          {/* Back Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md group"
            >
              <IoMdArrowRoundBack className="text-xl group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Title Bar */}
          <div className="bg-gradient-to-r from-pink-700 to-pink-600 rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center justify-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 shadow-sm">
                <h1 className="text-xl font-bold text-blue-700 text-center">
                  {baheeTypeName} की सभी Entries
                </h1>
              </div>
            </div>
          </div>

          {/* Bahee Details Display */}
          {baheeDetails.length > 0 && !fromThirdSelector && (
            <div className="bg-pink-700 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-bold text-white mb-3">
                वर्तमान बही ({baheeDetails.length} बही मिली)
              </h3>

            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Search & Add Button */}
            <div className="p-4 bg-gray-50 border-b space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    खोजें
                  </label>
                  <TransliterateSearch
                    value={searchText}
                    onChange={handleSearchChange}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    placeholder="नाम, जाति, पिता का नाम से खोजें..."
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddEntries}
                    size="large"
                    className="bg-green-600 hover:bg-green-700 w-full lg:w-auto"
                  >
                    नई Entries जोड़ें
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="p-4 bg-blue-50 border-b">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">कुल Entries</div>
                  <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">कुल आवता</div>
                  <div className="text-xl font-bold text-green-600">
                    ₹{totalAavta.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">कुल ऊपर नेत</div>
                  <div className="text-xl font-bold text-purple-600">
                    ₹{totalUpar.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Grand Total</div>
                  <div className="text-xl font-bold text-red-600">
                    ₹{grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Page Stats */}
            {filteredData.length > (pagination.pageSize || 10) && (
              <div className="p-3 bg-yellow-50 border-b">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <span className="text-gray-600">पेज आवता: </span>
                    <span className="font-bold text-green-700">₹{pageAavta.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">पेज ऊपर नेत: </span>
                    <span className="font-bold text-purple-700">₹{pageUpar.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">पेज Total: </span>
                    <span className="font-bold text-red-700">₹{pageTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              <Table<DataType>
                columns={columns}
                dataSource={currentSlice}
                pagination={{
                  ...pagination,
                  total: filteredData.length,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} entries`,
                  position: ["bottomCenter"],
                }}
                onChange={onChange}
                rowKey="key"
                loading={loading}
                bordered
                size="small"
                scroll={{ x: 1200 }}
                locale={{
                  emptyText: searchText
                    ? "कोई परिणाम नहीं मिला"
                    : "कोई डेटा उपलब्ध नहीं है",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Entry Modal */}
      <CommonModal
        open={editOpen}
        title="Entry संपादित करें"
        onOk={saveEdit}
        onCancel={() => {
          setEditOpen(false);
          setCurrent(null);
          form.resetFields();
        }}
        okText="Save करें"
        cancelText="Cancel करें"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="जाति"
            name="cast"
            rules={[{ required: true, message: "जाति दर्ज करें" }]}
          >
            <ReactTransliterate
              value={form.getFieldValue("cast")}
              onChangeText={(text) => form.setFieldsValue({ cast: text })}
              lang="hi"
              placeholder="जाति..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label="नाम"
            name="name"
            rules={[{ required: true, message: "नाम दर्ज करें" }]}
          >
            <ReactTransliterate
              value={form.getFieldValue("name")}
              onChangeText={(text) => form.setFieldsValue({ name: text })}
              lang="hi"
              placeholder="नाम..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label="पिता का नाम"
            name="fathername"
            rules={[{ required: true, message: "पिता का नाम दर्ज करें" }]}
          >
            <ReactTransliterate
              value={form.getFieldValue("fathername")}
              onChangeText={(text) => form.setFieldsValue({ fathername: text })}
              lang="hi"
              placeholder="पिता का नाम..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item
            label="गाँव का नाम"
            name="address"
            rules={[{ required: true, message: "गाँव का नाम दर्ज करें" }]}
          >
            <ReactTransliterate
              value={form.getFieldValue("address")}
              onChangeText={(text) => form.setFieldsValue({ address: text })}
              lang="hi"
              placeholder="गाँव का नाम..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="आवता"
              name="aavta"
              rules={[{ required: true, message: "आवता राशि दर्ज करें" }]}
            >
              <Input type="number" placeholder="0" prefix="₹" />
            </Form.Item>

            <Form.Item
              label="ऊपर नेत"
              name="uparnet"
              rules={[{ required: true, message: "ऊपर नेत राशि दर्ज करें" }]}
            >
              <Input type="number" placeholder="0" prefix="₹" />
            </Form.Item>
          </div>
        </Form>
      </CommonModal>

      {/* View Entry Modal */}
      <CommonModal
        open={viewModal.open}
        title="Entry विवरण"
        onOk={handleViewCancel}
        onCancel={handleViewCancel}
        okText="Close"
        cancelButtonProps={{ style: { display: "none" } }}
        width={600}
      >
        {viewModal.record && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 font-medium">जाति:</span>
                <p className="text-lg font-semibold capitalize">{viewModal.record.cast}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">नाम:</span>
                <p className="text-lg font-semibold">{viewModal.record.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 font-medium">पिता का नाम:</span>
                <p className="text-lg font-semibold">{viewModal.record.fathername}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">गाँव:</span>
                <p className="text-lg font-semibold">{viewModal.record.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="bg-green-50 p-3 rounded-lg">
                <span className="text-gray-600 font-medium">आवता:</span>
                <p className="text-xl font-bold text-green-600">
                  ₹{(viewModal.record.aavta ?? 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <span className="text-gray-600 font-medium">ऊपर नेत:</span>
                <p className="text-xl font-bold text-purple-600">
                  ₹{(viewModal.record.uparnet ?? 0).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-gray-600 font-medium">कुल राशि:</span>
              <p className="text-2xl font-bold text-blue-600">
                ₹{((viewModal.record.aavta ?? 0) + (viewModal.record.uparnet ?? 0)).toLocaleString()}
              </p>
            </div>

            {lockedKeys[viewModal.record.key] && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center gap-2">
                <LockOutlined className="text-yellow-600" />
                <span className="text-yellow-800 font-medium">यह Entry लॉक है</span>
              </div>
            )}
          </div>
        )}
      </CommonModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="Entry हटाएं?"
        content={
          deleteModal.record ? (
            <div className="space-y-2">
              <p>क्या आप <span className="text-red-600 font-bold">{deleteModal.record.name}</span> की इस Entry को हटाना चाहते हैं?</p>
              <div className="bg-gray-50 p-3 rounded-lg mt-3">
                <p className="font-semibold">{deleteModal.record.name}</p>
                <p className="text-sm text-gray-600">पिता: {deleteModal.record.fathername}</p>
                <p className="text-sm text-gray-600">जाति: {deleteModal.record.cast}</p>
              </div>
            </div>
          ) : null
        }
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="हाँ, हटाएं"
        cancelText="रद्द करें"
        okType="danger"
        confirmLoading={deleteLoading}
      />
    <Footer/>
    </>
  );
};

export default ViewEntriesByType;
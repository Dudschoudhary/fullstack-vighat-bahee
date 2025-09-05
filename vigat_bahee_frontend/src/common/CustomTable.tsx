// components/AddNewEntriesInterface.tsx
import React, { useMemo, useState, useEffect } from "react";
import { Space, Table, Button, Form, message, DatePicker, Select, Switch, Input, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, FilterOutlined, UnorderedListOutlined, RollbackOutlined, SaveOutlined, LockOutlined, PlusOutlined, HomeOutlined } from "@ant-design/icons";
import type { TableProps, TablePaginationConfig } from "antd";
import { ReactTransliterate } from 'react-transliterate';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import CommonModal from "../common/CommonModal";
import ConfirmModal from "../common/ConfirmModal";
import EditRecordForm, { type EditValues } from "../common/EditRecordForm";
import { useAddNewEntriesInterface } from "../hooks/useAddNewEntriesInterface";
import TransliterateSearch from "../components/TransliterateSearch";
import BaheeEditForm from "../common/BaheeEditForm";
import CustomVigatBaheeLogo from "../common/CustomVigatBaheeLogo";
import type { DataType, BaheeDetails, ReturnNetLog } from "../types/addNewEntriesInterface.types";

const { Option } = Select;
const { TextArea } = Input;

interface AddNewEntriesInterfaceProps {
  currentBaheeType?: string;
  selectedBaheeId?: string;
}

const AddNewEntriesInterface: React.FC<AddNewEntriesInterfaceProps> = ({ 
  currentBaheeType, 
  selectedBaheeId 
}) => {
  const navigate = useNavigate();
  
  const {
    data,
    baheeDetails,
    lockedKeys,
    selectedBaheeType,
    setSelectedBaheeType,
    loading,
    contextualBaheeDetails,
    baheeTypeOptions,
    updateEntry,
    deleteEntry,
    updateBaheeDetails,
    addReturnNetLog,
    getReturnNetLogForRecord,
    selectedBaheeDetails
  } = useAddNewEntriesInterface(currentBaheeType, selectedBaheeId);
  // Search and filtered data
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<DataType[]>([]);
  
  // Selected specific bahee person state
  const [selectedSpecificBahee, setSelectedSpecificBahee] = useState<BaheeDetails | null>(null);

  // Modal states
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<DataType | null>(null);
  const [form] = Form.useForm<EditValues>();

  const [baheeViewOpen, setBaheeViewOpen] = useState(false);
  const [baheeEditOpen, setBaheeEditOpen] = useState(false);
  const [currentBahee, setCurrentBahee] = useState<BaheeDetails | null>(null);
  const [baheeForm] = Form.useForm();

  const [deleteModal, setDeleteModal] = useState({ open: false, record: null as DataType | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [viewModal, setViewModal] = useState({ open: false, record: null as DataType | null });

  const [returnNetOpen, setReturnNetOpen] = useState(false);
  const [returnNetForm] = Form.useForm();
  const [returnSaving, setReturnSaving] = useState(false);
  const [returnTarget, setReturnTarget] = useState<DataType | null>(null);

  // Pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showQuickJumper: true,
  });


  // Set default selection when contextual bahee details load
  useEffect(() => {
    if (contextualBaheeDetails.length > 0 && !selectedSpecificBahee) {
      // Select first bahee by default
      setSelectedSpecificBahee(contextualBaheeDetails[0]);
    }
  }, [contextualBaheeDetails, selectedSpecificBahee]);

  // Filter data based on selected bahee and search
  useEffect(() => {
    let filtered = data;
    
    // Filter by specific selected bahee person
    if (selectedSpecificBahee) {
      filtered = data.filter(r => 
        r.baheeType === selectedSpecificBahee.baheeType && 
        r.headerName === selectedSpecificBahee.name
      );
    } else if (selectedBaheeId) {
      // Filter by specific bahee ID
      const targetBahee = baheeDetails.find(b => b.id === selectedBaheeId);
      if (targetBahee) {
        filtered = data.filter(r => 
          r.baheeType === targetBahee.baheeType && 
          r.headerName === targetBahee.name
        );
      }
    } else if (selectedBaheeType !== "") {
      // Filter by bahee type
      filtered = data.filter(r => r.baheeType === selectedBaheeType);
    }

    // Apply search filter
    if (searchText !== "") {
      const query = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.cast.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.fathername.toLowerCase().includes(query) ||
        r.address.toLowerCase().includes(query) ||
        r.aavta.toString().includes(query) ||
        r.uparnet.toString().includes(query) ||
        (r.baheeTypeName && r.baheeTypeName.toLowerCase().includes(query))
      );
    }

    setFilteredData(filtered);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [data, selectedBaheeType, selectedBaheeId, searchText, baheeDetails, selectedSpecificBahee]);

  // Search handlers
  const handleSearch = (value: string) => setSearchText(value);
  const handleSearchChange = (value: string) => setSearchText(value);
  const handleClearSearch = () => setSearchText("");

  // Bahee type change handler
  const handleBaheeTypeChange = (value: string) => {
    setSelectedBaheeType(value);
    setSearchText("");
    setSelectedSpecificBahee(null); // Reset specific selection
  };

  // Navigate to Add Entries page
  const handleAddEntries = () => {
    let targetBahee: BaheeDetails | null = null;

    if (selectedSpecificBahee) {
      targetBahee = selectedSpecificBahee;
    } else if (selectedBaheeDetails) {
      targetBahee = selectedBaheeDetails;
    } else if (contextualBaheeDetails.length > 0) {
      targetBahee = contextualBaheeDetails[0];
    }

    if (targetBahee) {
      navigate('/new-bahee', {
        state: {
          baheeType: targetBahee.baheeType,
          baheeTypeName: targetBahee.baheeTypeName,
          existingBaheeData: targetBahee
        }
      });
    } else {
      message.warning("कृपया पहले बही चुनें");
    }
  };

  // Handle specific bahee selection from सूची button
  const handleSelectSpecificBahee = (bahee: BaheeDetails) => {
    setSelectedSpecificBahee(bahee);
    message.success(`${bahee.name} की बही चुनी गई`);
  };

  // Entry edit functions
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
      const aavta = Number(values.aavta ?? 0);
      const uparnet = Number(values.uparnet ?? 0);
      
      if (aavta === 0 && uparnet === 0) {
        message.error("आवता और ऊपर नेत दोनों एक साथ 0 नहीं हो सकते");
        return;
      }

      if (current) {
        const updatedEntry: DataType = {
          ...current,
          ...values,
          aavta,
          uparnet
        };

        const success = await updateEntry(updatedEntry);
        if (success) {
          setEditOpen(false);
          setCurrent(null);
          form.resetFields();
        }
      }
    } catch (error) {
      console.error('Edit save error:', error);
    }
  };

  // Bahee details functions
  const openBaheeView = (bahee: BaheeDetails) => {
    setCurrentBahee(bahee);
    setBaheeViewOpen(true);
  };

  const openBaheeEdit = (bahee: BaheeDetails) => {
    setCurrentBahee(bahee);
    setBaheeEditOpen(true);
    baheeForm.setFieldsValue({
      baheeTypeName: bahee.baheeTypeName,
      name: bahee.name,
      date: bahee.date ? dayjs(bahee.date) : null,
      tithi: bahee.tithi,
    });
  };

  const saveBaheeEdit = async () => {
    try {
      const values = await baheeForm.validateFields();
      if (!currentBahee) return;

      const updatedBahee: BaheeDetails = {
        ...currentBahee,
        baheeTypeName: values.baheeTypeName,
        name: values.name,
        date: values.date.format('YYYY-MM-DD'),
        tithi: values.tithi,
      };

      const success = await updateBaheeDetails(updatedBahee);
      if (success) {
        setBaheeEditOpen(false);
        setCurrentBahee(null);
        baheeForm.resetFields();
        
        // Update selected specific bahee if it was the one being edited
        if (selectedSpecificBahee && selectedSpecificBahee.id === updatedBahee.id) {
          setSelectedSpecificBahee(updatedBahee);
        }
      }
    } catch (error) {
      console.error('Bahee edit save error:', error);
    }
  };

  const closeBaheeModals = () => {
    setBaheeViewOpen(false);
    setBaheeEditOpen(false);
    setCurrentBahee(null);
    baheeForm.resetFields();
  };

  // Delete functions
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
      const success = await deleteEntry(deleteModal.record.key);
      if (success) {
        setDeleteModal({ open: false, record: null });
      }
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModal({ open: false, record: null });

  // View functions
  const openViewModal = (record: DataType) => {
    setViewModal({ open: true, record });
  };
  const handleViewCancel = () => setViewModal({ open: false, record: null });

  // Return Net functions
  const openReturnNetModal = (record: DataType) => {
    if (lockedKeys[record.key]) {
      message.warning("यह प्रविष्टि लॉक है");
      return;
    }
    setReturnTarget(record);
    setReturnNetOpen(true);
    setReturnSaving(false);
    returnNetForm.resetFields();
    returnNetForm.setFieldsValue({
      name: record?.name || "",
      date: dayjs(),
      description: "",
      confirmToggle: false
    });
  };

  const handleReturnNetSave = async () => {
    try {
      const values = await returnNetForm.validateFields();
      setReturnSaving(true);

      if (returnTarget) {
        const logData = {
          forKey: returnTarget.key,
          baheeType: returnTarget.baheeType || '',
          name: values.name,
          date: values.date?.format("YYYY-MM-DD") || '',
          description: values.description,
          confirmToggle: values.confirmToggle,
        };

        const success = await addReturnNetLog(logData);
        if (success) {
          setReturnNetOpen(false);
          setReturnTarget(null);
          returnNetForm.resetFields();
        }
      }
    } catch (error) {
      console.error('Return net save error:', error);
    } finally {
      setReturnSaving(false);
    }
  };

  // Go to bahee list (legacy function - now replaced with specific selection)
  const goToBaheeList = (bahee: BaheeDetails) => {
    handleSelectSpecificBahee(bahee);
  };

  // Highlight search text
  const highlightSearchText = (text: string, searchText: string) => {
    if (!searchText.trim()) return text;
    const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part)
        ? <span key={index} className="bg-yellow-200 font-medium">{part}</span>
        : part
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
        }
      },
      {
        title: "जाति",
        dataIndex: "cast",
        key: "cast",
        width: 120,
        render: (text) => (
          <span className="capitalize">
            {highlightSearchText(text, searchText)}
          </span>
        )
      },
      {
        title: "नाम",
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (text) => highlightSearchText(text, searchText)
      },
      {
        title: "पिता का नाम",
        dataIndex: "fathername",
        key: "fathername",
        width: 150,
        render: (text) => highlightSearchText(text, searchText)
      },
      {
        title: "गाँव का नाम",
        dataIndex: "address",
        key: "address",
        width: 200,
        render: (text) => highlightSearchText(text, searchText)
      },
      {
        title: "आवता",
        dataIndex: "aavta",
        key: "aavta",
        width: 120,
        align: "right",
        render: (value) => highlightSearchText(`₹${(value ?? 0).toLocaleString()}`, searchText)
      },
      {
        title: "ऊपर नेत",
        dataIndex: "uparnet",
        key: "uparnet",
        width: 120,
        align: "right",
        render: (value) => highlightSearchText(`₹${(value ?? 0).toLocaleString()}`, searchText)
      },
      {
        title: "कार्य",
        key: "action",
        width: 320,
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
                >
                  विवरण
                </Button>
              </Tooltip>

              <Tooltip title={isLocked ? "Locked: संपादन निष्क्रिय" : "संपादित करें"}>
                <span>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openEdit(record)}
                    className={isLocked ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}
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

              <Tooltip title={isLocked ? "Locked: प्रवेश बंद" : "वापस डाला गया नेत"}>
                <span>
                  <Button
                    type="default"
                    icon={isLocked ? <LockOutlined /> : <RollbackOutlined />}
                    size="small"
                    onClick={() => openReturnNetModal(record)}
                    disabled={isLocked}
                  >
                    {isLocked ? "Locked" : "वापस डाला गया नेत"}
                  </Button>
                </span>
              </Tooltip>
            </Space>
          );
        },
      },
    ],
    [searchText, pagination.current, pagination.pageSize, lockedKeys]
  );

  // Current page data and totals
  const currentSlice = useMemo(() => {
    const current = pagination.current ?? 1;
    const size = pagination.pageSize ?? 10;
    const start = (current - 1) * size;
    const end = start + size;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.current, pagination.pageSize]);

  const { pageAavta, pageUpar, pageTotal } = useMemo(() => {
    const pageAavta = currentSlice.reduce((sum, record) => sum + (Number(record.aavta) || 0), 0);
    const pageUpar = currentSlice.reduce((sum, record) => sum + (Number(record.uparnet) || 0), 0);
    return { pageAavta, pageUpar, pageTotal: pageAavta + pageUpar };
  }, [currentSlice]);

  const { totalAavta, totalUpar, grandTotal } = useMemo(() => {
    const totalAavta = filteredData.reduce((sum, record) => sum + (Number(record.aavta) || 0), 0);
    const totalUpar = filteredData.reduce((sum, record) => sum + (Number(record.uparnet) || 0), 0);
    return { totalAavta, totalUpar, grandTotal: totalAavta + totalUpar };
  }, [filteredData]);

  // Table pagination change
  const onChange: TableProps<DataType>["onChange"] = (paginationConfig) => {
    setPagination((prev) => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));
  };

  // Get display name for current selection
  const getDisplayName = () => {
    if (selectedSpecificBahee) {
      return `${selectedSpecificBahee.baheeTypeName} - ${selectedSpecificBahee.name}`;
    }
    if (selectedBaheeDetails) {
      return `${selectedBaheeDetails.baheeTypeName} - ${selectedBaheeDetails.name}`;
    }
    if (contextualBaheeDetails.length > 0) {
      return `${contextualBaheeDetails[0].baheeTypeName} - ${contextualBaheeDetails[0].name}`;
    }
    if (selectedBaheeType) {
      const bahee = baheeDetails.find(bd => bd.baheeType === selectedBaheeType);
      return bahee?.baheeTypeName || "अज्ञात बही";
    }
    return "सभी बही";
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">डेटा लोड हो रहा है...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Contextual Bahee Details - Enhanced */}
        {contextualBaheeDetails.length > 0 && (
          <div className="p-4 bg-blue-50 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <h3 className="text-lg font-bold text-gray-700">
                {currentBaheeType || selectedBaheeId ? 'वर्तमान बही विवरण:' : 'सहेजी गई बही विवरण:'}
              </h3>
              
              {/* Show selected person indicator */}
              {selectedSpecificBahee && (
                <div className="flex items-center gap-2 bg-green-100 border border-green-300 rounded-lg px-3 py-1">
                  <span className="text-green-700 text-sm font-medium">चयनित:</span>
                  <span className="text-green-800 font-semibold">{selectedSpecificBahee.name}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2">
              {contextualBaheeDetails.map((bd, index) => (
                <div 
                  key={bd.id || index} 
                  className={`border rounded-lg px-4 py-2 flex items-center justify-between gap-4 transition-all duration-200 ${
                    selectedSpecificBahee?.id === bd.id 
                      ? 'bg-green-50 border-green-300 shadow-md' 
                      : 'bg-white border-blue-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-4 overflow-x-auto" style={{ whiteSpace: "nowrap" }}>
                    <span className="text-lg">
                      {selectedSpecificBahee?.id === bd.id ? '✅' : '🕉️'}
                    </span>
                    <span className={`font-semibold ${selectedSpecificBahee?.id === bd.id ? 'text-green-800' : 'text-blue-800'}`}>
                      {bd.baheeTypeName}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">नाम: <b>{bd.name}</b></span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">तारीख: {bd.date}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">तिथि: {bd.tithi}</span>
                  </div>
                  <Space size="small" className="flex-shrink-0">
                    <Button 
                      type="primary" 
                      icon={<EyeOutlined />} 
                      size="small" 
                      onClick={() => openBaheeView(bd)} 
                      className="bg-green-500 hover:bg-green-600" 
                      title="देखें"
                    >
                      देखें
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<EditOutlined />} 
                      size="small" 
                      onClick={() => openBaheeEdit(bd)} 
                      className="bg-blue-500 hover:bg-blue-600" 
                      title="संपादित करें" 
                    />
                    <Button 
                      type={selectedSpecificBahee?.id === bd.id ? "primary" : "default"}
                      icon={<UnorderedListOutlined />} 
                      size="small" 
                      onClick={() => handleSelectSpecificBahee(bd)} 
                      className={selectedSpecificBahee?.id === bd.id ? "bg-green-600 hover:bg-green-700" : ""}
                      title={selectedSpecificBahee?.id === bd.id ? "चयनित बही" : "इस बही की entries देखें"}
                    >
                      {selectedSpecificBahee?.id === bd.id ? "चयनित" : "सूची"}
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header with Filter and Search - Enhanced */}
        <div className="p-4 border-b">
          <div className="flex flex-col space-y-4">
            {/* Title with Add Entries Button - Enhanced */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  विगत बही सूची - {getDisplayName()}
                </h2>
                
                {/* Add Entries Button - Center positioned */}
                <div className="flex justify-center lg:justify-start">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddEntries}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-6 py-2 text-base font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    size="large"
                  >
                    नई Entries जोड़ें
                  </Button>
                </div>
              </div>
              
              {!currentBaheeType && !selectedBaheeId && baheeTypeOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <FilterOutlined className="text-blue-500" />
                  <Select 
                    value={selectedBaheeType} 
                    onChange={handleBaheeTypeChange} 
                    className="min-w-[200px]" 
                    placeholder="बही प्रकार चुनें"
                    allowClear
                  >
                    {baheeTypeOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <TransliterateSearch
                value={searchText}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                placeholder="नाम, जाति, गाँव से खोजें..."
              />
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-blue-700 flex items-center">
                <SearchOutlined className="mr-1" /> परिणाम:
              </span>
              <span className="font-semibold text-blue-900">
                {filteredData.length} रिकॉर्ड 
                {searchText ? ` "${searchText}" के लिए` : ""}
              </span>
              {selectedSpecificBahee && (
                <span className="text-green-700 bg-green-100 px-2 py-1 rounded">
                  {selectedSpecificBahee.name} की entries
                </span>
              )}
              {(selectedBaheeType !== "" || searchText) && (
                <span className="text-blue-600">(कुल {data.length} में से)</span>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <Table<DataType>
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          onChange={onChange}
          pagination={{
            ...pagination,
            total: filteredData.length,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            position: ["bottomCenter"]
          }}
          scroll={{ x: 1100 }}
          size="middle"
          rowClassName={(record) => (lockedKeys[record.key] ? "opacity-60" : "")}
          locale={{
            emptyText: filteredData.length === 0
              ? (selectedSpecificBahee 
                  ? `${selectedSpecificBahee.name} की कोई entries नहीं मिली`
                  : (selectedBaheeType !== "" ? `${getDisplayName()} के लिए कोई रिकॉर्ड नहीं मिला`
                      : (searchText ? `"${searchText}" के लिए कोई परिणाम नहीं मिला` : 'कोई डेटा उपलब्ध नहीं है')))
              : 'कोई डेटा उपलब्ध नहीं है'
          }}
          loading={loading}
        />

        {/* Enhanced Totals Section */}
        <div className="px-4 pb-4 space-y-3">
          <div className="w-full rounded-md border bg-gray-50 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm sm:text-base font-medium text-gray-700">
                इस पेज के कुल ({getDisplayName()}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-gray-600">आवता:</span>
                  <span className="font-semibold text-red-900">₹{pageAavta.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-gray-600">ऊपर नेत:</span>
                  <span className="font-semibold text-red-900">₹{pageUpar.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-gray-600">पेज योग:</span>
                  <span className="font-semibold text-red-500">₹{pageTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full rounded-md border bg-blue-50 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm sm:text-base font-medium text-blue-700">
                कुल योग ({filteredData.length} रिकॉर्ड - {getDisplayName()}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-blue-600">आवता:</span>
                  <span className="font-bold text-blue-900">₹{totalAavta.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-blue-600">ऊपर नेत:</span>
                  <span className="font-bold text-blue-900">₹{totalUpar.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                  <span className="text-blue-600">महाकुल योग:</span>
                  <span className="font-bold text-blue-500 text-lg">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Modals remain the same... */}
      {/* Entry Edit Modal */}
      <CommonModal
        open={editOpen}
        title="रिकॉर्ड संपादित करें"
        onOk={saveEdit}
        onCancel={() => {
          setEditOpen(false);
          setCurrent(null);
          form.resetFields();
        }}
        okText="सेव करें"
        cancelText="रद्द करें"
        width={720}
        maskClosable={false}
        confirmLoading={loading}
      >
        <EditRecordForm form={form} initialValues={current || undefined} />
      </CommonModal>

      {/* Bahee View Modal */}
      <CommonModal
        open={baheeViewOpen}
        title="बही का विवरण"
        onOk={closeBaheeModals}
        onCancel={closeBaheeModals}
        okText="बंद करें"
        cancelButtonProps={{ style: { display: 'none' } }}
        width={600}
      >
        {currentBahee && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">बही प्रकार:</label>
                <p className="text-lg font-semibold text-blue-800">{currentBahee.baheeTypeName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">नाम:</label>
                <p className="text-lg font-semibold">{currentBahee.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">तारीख:</label>
                <p className="text-lg">{currentBahee.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">तिथि:</label>
                <p className="text-lg">{currentBahee.tithi}</p>
              </div>
            </div>
          </div>
        )}
      </CommonModal>

      {/* Bahee Edit Modal */}
      <CommonModal
        open={baheeEditOpen}
        title="बही विवरण संपादित करें"
        onOk={saveBaheeEdit}
        onCancel={closeBaheeModals}
        okText="सेव करें"
        cancelText="रद्द करें"
        width={720}
        maskClosable={false}
        confirmLoading={loading}
      >
        <BaheeEditForm form={baheeForm} initialValues={currentBahee || undefined} />
      </CommonModal>

      {/* Entry View Modal */}
      <CommonModal
        open={viewModal.open}
        title="बही का विवरण"
        onOk={handleViewCancel}
        onCancel={handleViewCancel}
        okText="बंद करें"
        cancelButtonProps={{ style: { display: 'none' } }}
        width={600}
      >
        {viewModal.record && (
          <div className="space-y-4">
            {lockedKeys[viewModal.record.key] && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                ⚠️ यह प्रविष्टि लॉक है; केवल विवरण देखा जा सकता है।
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">नाम:</label>
                <p className="text-lg font-semibold">{viewModal.record.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">जाति:</label>
                <p className="text-lg">{viewModal.record.cast}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">पिता का नाम:</label>
                <p className="text-lg">{viewModal.record.fathername}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">गाँव:</label>
                <p className="text-lg">{viewModal.record.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">आवता:</label>
                <p className="text-lg font-semibold text-green-600">₹{viewModal.record.aavta.toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">ऊपर नेत:</label>
                <p className="text-lg font-semibold text-blue-600">₹{viewModal.record.uparnet.toLocaleString()}</p>
              </div>
              {viewModal.record.baheeTypeName && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">बही प्रकार:</label>
                  <p className="text-lg">{viewModal.record.baheeTypeName}</p>
                </div>
              )}
            </div>

            {/* Return Net Details for Locked Entries */}
            {lockedKeys[viewModal.record.key] && (() => {
              const returnNetLog = getReturnNetLogForRecord(viewModal.record.key);
              return returnNetLog ? (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    <RollbackOutlined className="mr-2" />
                    वापस डाला गया नेत का विवरण
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700">नाम:</label>
                      <p className="text-base font-semibold text-red-900">{returnNetLog.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700">तारीख:</label>
                      <p className="text-base text-red-800">{returnNetLog.date}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-red-700">विवरण:</label>
                      <p className="text-base text-red-800 bg-white p-2 rounded border">{returnNetLog.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700">पुष्टि स्थिति:</label>
                      <p className="text-base text-red-800">{returnNetLog.confirmToggle ? "✅ हाँ" : "❌ नहीं"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-red-700">लॉक की गई:</label>
                      <p className="text-sm text-red-600">{new Date(returnNetLog.createdAt).toLocaleString('hi-IN')}</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </CommonModal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="रिकॉर्ड हटाएं"
        content={`क्या आप "${deleteModal.record?.name}" का रिकॉर्ड हटाना चाहते हैं?`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
        confirmText="हटाएं"
        cancelText="रद्द करें"
        danger={true}
      />

      {/* Return Net Modal */}
      <CommonModal
        open={returnNetOpen}
        title="वापस डाला गया नेत"
        onOk={handleReturnNetSave}
        onCancel={() => {
          setReturnNetOpen(false);
          setReturnSaving(false);
          setReturnTarget(null);
          returnNetForm.resetFields();
        }}
        okText={<><SaveOutlined /> सहेजें</>}
        cancelText="रद्द करें"
        width={640}
        maskClosable={false}
        confirmLoading={returnSaving}
      >
        <Form form={returnNetForm} layout="vertical" disabled={returnSaving}>
          <Form.Item 
            name="name" 
            label="नाम" 
            rules={[{ required: true, message: 'नाम दर्ज करें' }]}
          >
            <ReactTransliterate 
              lang="hi" 
              placeholder="नाम दर्ज करें" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" 
              style={{ height: 40 }} 
            />
          </Form.Item>
          <Form.Item 
            name="date" 
            label="तारीख" 
            rules={[{ required: true, message: 'तारीख चुनें' }]}
          >
            <DatePicker 
              format="YYYY-MM-DD" 
              className="w-full" 
              placeholder="तारीख चुनें" 
            />
          </Form.Item>
          <Form.Item 
            name="description" 
            label="विवरण" 
            rules={[{ required: true, message: 'विवरण दर्ज करें' }]}
          >
            <ReactTransliterate 
              renderComponent={(props: any) => (<TextArea {...props} rows={4} />)} 
              lang="hi" 
              placeholder="विवरण लिखें..." 
              className="w-full" 
            />
          </Form.Item>
          <Form.Item 
            name="confirmToggle" 
            label="पुष्टि" 
            valuePropName="checked" 
            rules={[{ 
              validator: (_, value) => 
                value ? Promise.resolve() : Promise.reject(new Error('कृपया टॉगल ऑन करें')) 
            }]}
          >
            <Switch 
              checkedChildren="हाँ" 
              unCheckedChildren="नहीं" 
            />
          </Form.Item>
        </Form>
      </CommonModal>
    </>
  );
};

export default AddNewEntriesInterface;
import React, { useMemo, useState, useEffect } from "react";
import { Space, Table, Button, Form, message, DatePicker, Select, Switch, Input, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined, FilterOutlined, UnorderedListOutlined, RollbackOutlined, SaveOutlined, LockOutlined } from "@ant-design/icons";
import type { TableProps, TablePaginationConfig } from "antd";
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';
import dayjs from 'dayjs';
import CommonModal from "../common/CommonModal";
import ConfirmModal from "../common/ConfirmModal";
import EditRecordForm, { type EditValues } from "../common/EditRecordForm";

const { Option } = Select;
const { TextArea } = Input;

interface DataType {
  key: string;
  sno: string;
  cast: string;
  name: string;
  fathername: string;
  address: string;
  aavta: number;
  uparnet: number;
  baheeType?: string;
  baheeTypeName?: string;
  submittedAt?: string;
}

interface BaheeDetails {
  id: string;
  baheeType: string;
  baheeTypeName: string;
  name: string;
  date: string;
  tithi: string;
  createdAt: string;
}

interface ReturnNetLog {
  forKey: string;
  baheeType: string;
  name: string;
  date: string;
  description: string;
  confirmToggle: boolean;
  createdAt: string;
}

interface AddNewEntriesInterfaceProps {
  currentBaheeType?: string;
}

// Fixed Responsive Transliterate Search Component
const TransliterateSearch: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}> = ({ value, onChange, onSearch, onClear, placeholder }) => {
  return (
    <div className="relative w-full max-w-md sm:max-w-lg">
      <ReactTransliterate
        value={value}
        onChangeText={(text: string) => onChange(text)}
        lang="hi"
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg pl-4 pr-20 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        style={{ fontSize: '14px', lineHeight: '1.5', fontFamily: 'inherit', boxSizing: 'border-box', height: '44px' }}
        onKeyDown={(e: any) => { if (e.key === 'Enter') onSearch(value); }}
      />
      <button
        type="button"
        onClick={() => onSearch(value)}
        className="absolute inset-y-0 right-0 flex items-center justify-center w-12 bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Search"
      >
        <SearchOutlined className="text-lg" />
      </button>
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-12 flex items-center justify-center w-8 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Clear search"
        >
          <span className="text-lg">✕</span>
        </button>
      )}
    </div>
  );
};

// Bahee Edit Form Component - FIXED
const BaheeEditForm: React.FC<{ form: any; initialValues?: BaheeDetails }> = ({ form }) => {
  const [formData, setFormData] = useState({
    baheeTypeName: '',
    name: '',
    tithi: ''
  });

  // Watch form values and update local state
  useEffect(() => {
    const values = form.getFieldsValue();
    setFormData({
      baheeTypeName: values.baheeTypeName || '',
      name: values.name || '',
      tithi: values.tithi || ''
    });
  }, [form]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    form.setFieldsValue({ [field]: value });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="baheeTypeName" label="बही प्रकार नाम" rules={[{ required: true, message: 'बही प्रकार नाम दर्ज करें' }]}>
        <ReactTransliterate
          value={formData.baheeTypeName}
          onChangeText={(text: string) => handleFieldChange('baheeTypeName', text)}
          lang="hi"
          placeholder="बही प्रकार नाम दर्ज करें"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ height: '40px' }}
        />
      </Form.Item>
      <Form.Item name="name" label="नाम" rules={[{ required: true, message: 'नाम दर्ज करें' }]}>
        <ReactTransliterate
          value={formData.name}
          onChangeText={(text: string) => handleFieldChange('name', text)}
          lang="hi"
          placeholder="नाम दर्ज करें"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ height: '40px' }}
        />
      </Form.Item>
      <Form.Item name="date" label="तारीख" rules={[{ required: true, message: 'तारीख चुनें' }]}>
        <DatePicker format="YYYY-MM-DD" className="w-full" placeholder="तारीख चुनें" />
      </Form.Item>
      <Form.Item name="tithi" label="तिथि" rules={[{ required: true, message: 'तिथि दर्ज करें' }]}>
        <ReactTransliterate
          value={formData.tithi}
          onChangeText={(text: string) => handleFieldChange('tithi', text)}
          lang="hi"
          placeholder="तिथि दर्ज करें"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ height: '40px' }}
        />
      </Form.Item>
    </Form>
  );
};

const AddNewEntriesInterface: React.FC<AddNewEntriesInterfaceProps> = ({ currentBaheeType }) => {
  const [data, setData] = useState<DataType[]>([]);
  const [baheeDetails, setBaheeDetails] = useState<BaheeDetails[]>([]);
  const [selectedBaheeType, setSelectedBaheeType] = useState<string>("");
  const [returnNetLogs, setReturnNetLogs] = useState<ReturnNetLog[]>([]);

  // Return Net modal
  const [returnNetOpen, setReturnNetOpen] = useState(false);
  const [returnNetForm] = Form.useForm();
  const [returnSaving, setReturnSaving] = useState(false);
  const [returnTarget, setReturnTarget] = useState<DataType | null>(null);

  // Per-row lock map
  const [lockedKeys, setLockedKeys] = useState<Record<string, boolean>>({});

  // detect bahee type
  const detectCurrentBaheeType = () => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/vivah')) return 'vivah';
    if (currentPath.includes('/muklawa')) return 'muklawa';
    const currentPageContext = localStorage.getItem('currentBaheeContext');
    if (currentPageContext) return currentPageContext;
    return null;
  };

  // sample data (unchanged)
  const generateSampleData = () => {
    const vivahEntries = [
      { cast: "जाट", name: "दूदाराम", fathername: "मोटाराम", address: "नई ऊंदरी, गुड़ामालानी", aavta: 250, uparnet: 250 },
      { cast: "कलबी", name: "मुकेश कुमार", fathername: "शंकराराम", address: "मानपुरा, नई ऊंदरी, गुड़ामालानी", aavta: 200, uparnet: 300 },
      { cast: "ब्राह्मण", name: "रमेश कुमार", fathername: "सुरेश", address: "जयपुर, राजस्थान", aavta: 450, uparnet: 600 },
      { cast: "राजपूत", name: "विकास सिंह", fathername: "गजराज सिंह", address: "बीकानेर, राजस्थान", aavta: 300, uparnet: 500 },
      { cast: "गुर्जर", name: "सुनील कुमार", fathername: "रामकिशन", address: "अलवर, राजस्थान", aavta: 180, uparnet: 350 },
      { cast: "मीणा", name: "राहुल मीणा", fathername: "बनवारी मीणा", address: "दौसा, राजस्थान", aavta: 220, uparnet: 400 },
      { cast: "जाट", name: "अमित कुमार", fathername: "हरिराम", address: "श्रीगंगानगर, राजस्थान", aavta: 280, uparnet: 450 },
      { cast: "अग्रवाल", name: "नितिन अग्रवाल", fathername: "सुरेश अग्रवाल", address: "जोधपुर, राजस्थान", aavta: 350, uparnet: 550 },
      { cast: "ब्राह्मण", name: "आदित्य शर्मा", fathername: "राज शर्मा", address: "उदयपुर, राजस्थान", aavta: 400, uparnet: 650 },
      { cast: "कुम्हार", name: "दिनेश", fathername: "रमेश", address: "कोटा, राजस्थान", aavta: 150, uparnet: 250 },
      { cast: "लोहार", name: "संदीप", fathername: "प्रेम चन्द", address: "भरतपुर, राजस्थान", aavta: 170, uparnet: 280 },
      { cast: "तेली", name: "मनोज तेली", fathername: "राधेश्याम", address: "सीकर, राजस्थान", aavta: 190, uparnet: 320 },
      { cast: "सुथार", name: "गोविन्द", fathername: "मदन लाल", address: "झुंझुनूं, राजस्थान", aavta: 210, uparnet: 340 },
      { cast: "रैगर", name: "प्रदीप", fathername: "जगदीश", address: "पाली, राजस्थान", aavta: 160, uparnet: 270 },
      { cast: "माली", name: "सुरेश माली", fathername: "भूपेंद्र", address: "बाड़मेर, राजस्थान", aavta: 140, uparnet: 230 },
      { cast: "नाई", name: "राकेश", fathername: "मुकेश", address: "जैसलमेर, राजस्थान", aavta: 120, uparnet: 200 },
      { cast: "धोबी", name: "अनिल", fathername: "सुनील", address: "हनुमानगढ़, राजस्थान", aavta: 130, uparnet: 220 },
      { cast: "चमार", name: "राम प्रसाद", fathername: "श्याम लाल", address: "चूरू, राजस्थान", aavta: 110, uparnet: 180 },
      { cast: "बंजारा", name: "सतीश", fathername: "रतन", address: "राजसमंद, राजस्थान", aavta: 200, uparnet: 300 },
      { cast: "गडरिया", name: "कैलाश", fathername: "गणेश", address: "डूंगरपुर, राजस्थान", aavta: 180, uparnet: 290 }
    ];
    const muklawaEntries = [
      { cast: "जाट", name: "सुनीता", fathername: "रामकिशन", address: "हिसार, हरियाणा", aavta: 300, uparnet: 400 },
      { cast: "कलबी", name: "प्रीति", fathername: "बालकिशन", address: "भिवानी, हरियाणा", aavta: 250, uparnet: 350 },
      { cast: "ब्राह्मण", name: "अंजली शर्मा", fathername: "विष्णु शर्मा", address: "रोहतक, हरियाणा", aavta: 500, uparnet: 700 },
      { cast: "राजपूत", name: "सीमा राठौड़", fathername: "मान सिंह", address: "झझ्जर, हरियाणा", aavta: 350, uparnet: 550 },
      { cast: "गुर्जर", name: "पूजा गुर्जर", fathername: "सुरेंद्र", address: "रेवाड़ी, हरियाणा", aavta: 200, uparnet: 380 },
      { cast: "मीणा", name: "सरिता मीणा", fathername: "गोपाल मीणा", address: "महेंद्रगढ़, हरियाणा", aavta: 270, uparnet: 420 },
      { cast: "जाट", name: "रेखा", fathername: "धर्मपाल", address: "सिरसा, हरियाणा", aavta: 320, uparnet: 480 },
      { cast: "अग्रवाल", name: "मंजू अग्रवाल", fathername: "राम अग्रवाल", address: "फतेहाबाद, हरियाणा", aavta: 400, uparnet: 600 },
      { cast: "ब्राह्मण", name: "गीता शर्मा", fathername: "कृष्ण शर्मा", address: "जींद, हरियाणा", aavta: 450, uparnet: 680 },
      { cast: "कुम्हार", name: "सुमित्रा", fathername: "राधेलाल", address: "करनाल, हरियाणा", aavta: 180, uparnet: 280 },
      { cast: "लोहार", name: "कमला", fathername: "हर्षवर्धन", address: "कुरुक्षेत्र, हरियाणा", aavta: 190, uparnet: 300 },
      { cast: "तेली", name: "संगीता तेली", fathername: "गोपीचंद", address: "पंचकुला, हरियाणा", aavta: 210, uparnet: 340 },
      { cast: "सुथार", name: "सुशीला", fathername: "हरि ओम", address: "अंबाला, हरियाणा", aavta: 230, uparnet: 360 },
      { cast: "रैगर", name: "उषा", fathername: "रामेश्वर", address: "यमुनानगर, हरियाणा", aavta: 170, uparnet: 290 },
      { cast: "माली", name: "सुनीता माली", fathername: "दयाराम", address: "पलवल, हरियाणा", aavta: 160, uparnet: 250 },
      { cast: "नाई", name: "मीरा", fathername: "सोहनलाल", address: "नूंह, हरियाणा", aavta: 140, uparnet: 220 },
      { cast: "धोबी", name: "सरोज", fathername: "मोहनलाल", address: "गुड़गांव, हरियाणा", aavta: 150, uparnet: 240 },
      { cast: "चमार", name: "सुभाष", fathername: "ओमप्रकाश", address: "फरीदाबाद, हरियाणा", aavta: 130, uparnet: 200 },
      { cast: "बंजारा", name: "कमलेश", fathername: "मुकेश", address: "सोनीपत, हरियाणा", aavta: 220, uparnet: 320 },
      { cast: "गडरिया", name: "राजेश", fathername: "नरेंद्र", address: "चरखी दादरी, हरियाणा", aavta: 200, uparnet: 310 }
    ];
    
    const sampleData: DataType[] = [];
    vivahEntries.forEach((entry, index) => sampleData.push({ key: `vivah-${index + 1}`, sno: (index + 1).toString(), ...entry, baheeType: 'vivah', baheeTypeName: 'विवाह की विगत', submittedAt: `2025-08-${String(index + 1).padStart(2, '0')}` }));
    muklawaEntries.forEach((entry, index) => sampleData.push({ key: `muklawa-${index + 1}`, sno: (index + 21).toString(), ...entry, baheeType: 'muklawa', baheeTypeName: 'मुकलावा की विगत', submittedAt: `2025-08-${String(index + 15).padStart(2, '0')}` }));
    return sampleData;
  };

  // Load data
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('baheeEntries') || '[]');
    const savedBaheeDetails = JSON.parse(localStorage.getItem('baheeDetailsSavedArr') || '[]');
    const savedReturnNetLogs = JSON.parse(localStorage.getItem('returnNetLogs') || '[]');
    const detectedBaheeType = currentBaheeType || detectCurrentBaheeType();

    const formattedEntries = savedEntries.map((entry: any, index: number) => ({
      key: entry.submittedAt || `entry-${index}`,
      sno: (index + 1).toString(),
      cast: entry.caste || entry.cast || '',
      name: entry.name || '',
      fathername: entry.fatherName || entry.fathername || '',
      address: entry.villageName || entry.address || '',
      aavta: Number(entry.income) || Number(entry.aavta) || 0,
      uparnet: Number(entry.amount) || Number(entry.uparnet) || 0,
      baheeType: entry.baheeType || '',
      baheeTypeName: entry.baheeTypeName || '',
      submittedAt: entry.submittedAt || ''
    }));

    let dataToUse = formattedEntries.length > 0 ? formattedEntries : generateSampleData();
    setData(dataToUse);
    setReturnNetLogs(savedReturnNetLogs);

    // Set locked keys based on return net logs
    const lockedKeysMap: Record<string, boolean> = {};
    savedReturnNetLogs.forEach((log: ReturnNetLog) => {
      if (log.forKey) {
        lockedKeysMap[log.forKey] = true;
      }
    });
    setLockedKeys(lockedKeysMap);

    if (savedBaheeDetails.length === 0) {
      const sampleBaheeDetails: BaheeDetails[] = [
        { id: 'vivah-1', baheeType: 'vivah', baheeTypeName: 'विवाह की विगत', name: 'दूदाराम', date: '2025-08-23', tithi: 'कृष्ण अष्टमी', createdAt: '2025-08-23' },
        { id: 'muklawa-1', baheeType: 'muklawa', baheeTypeName: 'मुकलावा की विगत', name: 'सुनीता', date: '2025-08-20', tithi: 'शुक्ल पंचमी', createdAt: '2025-08-20' }
      ];
      setBaheeDetails(sampleBaheeDetails);
      localStorage.setItem('baheeDetailsSavedArr', JSON.stringify(sampleBaheeDetails));
    } else {
      setBaheeDetails(savedBaheeDetails);
    }

    if (detectedBaheeType) setSelectedBaheeType(detectedBaheeType);
    else if (savedBaheeDetails.length > 0) setSelectedBaheeType(savedBaheeDetails[0]?.baheeType || 'vivah');
    else setSelectedBaheeType('vivah');
  }, [currentBaheeType]);

  // contextual details
  const contextualBaheeDetails = useMemo(() => {
    if (!currentBaheeType && selectedBaheeType === "") return baheeDetails;
    const target = currentBaheeType || selectedBaheeType;
    if (!target) return baheeDetails;
    return baheeDetails.filter(bd => bd.baheeType === target);
  }, [baheeDetails, currentBaheeType, selectedBaheeType]);

  // search and filtered
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<DataType[]>(data);

  // edit modal for entries
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<DataType | null>(null);
  const [form] = Form.useForm<EditValues>();

  // bahee details modals
  const [baheeViewOpen, setBaheeViewOpen] = useState(false);
  const [baheeEditOpen, setBaheeEditOpen] = useState(false);
  const [currentBahee, setCurrentBahee] = useState<BaheeDetails | null>(null);
  const [baheeForm] = Form.useForm();

  // delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, record: null as DataType | null });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // view entry modal
  const [viewModal, setViewModal] = useState({ open: false, record: null as DataType | null });

  // pagination
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
    showQuickJumper: true,
  });

  // bahee type options
  const baheeTypeOptions = useMemo(() => {
    const uniqueTypes = [...new Set(baheeDetails.map(bd => bd.baheeType))];
    return uniqueTypes.map(type => {
      const bahee = baheeDetails.find(bd => bd.baheeType === type);
      return { value: type, label: bahee?.baheeTypeName || type };
    });
  }, [baheeDetails]);

  // filter by type + search
  useEffect(() => {
    let filtered = data;
    if (selectedBaheeType !== "") filtered = data.filter(r => r.baheeType === selectedBaheeType);
    if (searchText !== "") {
      const q = searchText.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.cast.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.fathername.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q) ||
        r.aavta.toString().includes(q) ||
        r.uparnet.toString().includes(q) ||
        (r.baheeTypeName && r.baheeTypeName.toLowerCase().includes(q))
      );
    }
    setFilteredData(filtered);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, [data, selectedBaheeType, searchText]);

  // search handlers
  const handleSearch = (v: string) => setSearchText(v);
  const handleSearchChange = (v: string) => setSearchText(v);
  const handleClearSearch = () => setSearchText("");

  // bahee type change
  const handleBaheeTypeChange = (v: string) => setSelectedBaheeType(v);

  // entry edit
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
      const a = Number(values.aavta ?? 0);
      const u = Number(values.uparnet ?? 0);
      if (a === 0 && u === 0) { message.error("आवता और ऊपर नेत दोनों एक साथ 0 नहीं हो सकते"); return; }
      await new Promise((r) => setTimeout(r, 200));
      const updatedData = data.map((row) => (row.key === current?.key ? { ...row, ...values } : row));
      setData(updatedData);
      const savedEntries = updatedData.map((item) => ({
        sno: item.sno, caste: item.cast, name: item.name, fatherName: item.fathername, villageName: item.address,
        income: item.aavta.toString(), amount: item.uparnet.toString(),
        baheeType: item.baheeType, baheeTypeName: item.baheeTypeName, submittedAt: item.submittedAt
      }));
      localStorage.setItem('baheeEntries', JSON.stringify(savedEntries));
      setEditOpen(false);
      setCurrent(null);
      form.resetFields();
      message.success("रिकॉर्ड सफलतापूर्वक अपडेट हो गया");
    } catch {}
  };

  // bahee details functions
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
        ...currentBahee, baheeTypeName: values.baheeTypeName, name: values.name,
        date: values.date.format('YYYY-MM-DD'), tithi: values.tithi,
      };
      const updatedBaheeDetails = baheeDetails.map((b) => b.id === currentBahee.id ? updatedBahee : b);
      setBaheeDetails(updatedBaheeDetails);
      localStorage.setItem('baheeDetailsSavedArr', JSON.stringify(updatedBaheeDetails));

      if (values.baheeTypeName !== currentBahee.baheeTypeName) {
        const updatedData = data.map((entry) =>
          entry.baheeType === currentBahee.baheeType ? { ...entry, baheeTypeName: values.baheeTypeName } : entry
        );
        setData(updatedData);
        const savedEntries = updatedData.map((item) => ({
          sno: item.sno, caste: item.cast, name: item.name, fatherName: item.fathername, villageName: item.address,
          income: item.aavta.toString(), amount: item.uparnet.toString(),
          baheeType: item.baheeType, baheeTypeName: item.baheeTypeName, submittedAt: item.submittedAt
        }));
        localStorage.setItem('baheeEntries', JSON.stringify(savedEntries));
      }

      setBaheeEditOpen(false);
      setCurrentBahee(null);
      baheeForm.resetFields();
      message.success("बही विवरण सफलतापूर्वक अपडेट हो गया");
    } catch {}
  };

  const closeBaheeModals = () => {  
    setBaheeViewOpen(false);
    setBaheeEditOpen(false);
    setCurrentBahee(null);
    baheeForm.resetFields();
  };

  // delete functions
  const openDeleteModal = (record: DataType) => {
    if (lockedKeys[record.key]) { message.warning("यह प्रविष्टि लॉक है"); return; }
    setDeleteModal({ open: true, record });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.record) return;
    setDeleteLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedData = data.filter((r) => r.key !== deleteModal.record!.key);
      setData(updatedData);
      const savedEntries = updatedData.map((item) => ({
        sno: item.sno, caste: item.cast, name: item.name, fatherName: item.fathername, villageName: item.address,
        income: item.aavta.toString(), amount: item.uparnet.toString(),
        baheeType: item.baheeType, baheeTypeName: item.baheeTypeName, submittedAt: item.submittedAt
      }));
      localStorage.setItem('baheeEntries', JSON.stringify(savedEntries));
      setDeleteModal({ open: false, record: null });
      message.success("रिकॉर्ड सफलतापूर्वक डिलीट हो गया");
    } catch {
      message.error("रिकॉर्ड डिलीट करने में त्रुटि");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => setDeleteModal({ open: false, record: null });

  // view functions - UPDATED to show return net details for locked entries
  const openViewModal = (record: DataType) => {
    setViewModal({ open: true, record });
  };
  const handleViewCancel = () => setViewModal({ open: false, record: null });

  // Get return net log for a specific record
  const getReturnNetLogForRecord = (recordKey: string): ReturnNetLog | null => {
    return returnNetLogs.find(log => log.forKey === recordKey) || null;
  };

  // Return Net open
  const openReturnNetModal = (record: DataType) => {
    if (lockedKeys[record.key]) { message.warning("यह प्रविष्टि लॉक है"); return; }
    setReturnTarget(record);
    setReturnNetOpen(true);
    setReturnSaving(false);
    returnNetForm.resetFields();
    returnNetForm.setFieldsValue({ name: record?.name || "", date: dayjs(), description: "", confirmToggle: false });
  };

  const handleReturnNetSave = async () => {
    try {
      const values = await returnNetForm.validateFields();
      setReturnSaving(true);
      await new Promise((r) => setTimeout(r, 800));
      const prev = JSON.parse(localStorage.getItem("returnNetLogs") || "[]");
      const newLog = {
        forKey: returnTarget?.key,
        baheeType: returnTarget?.baheeType,
        name: values.name,
        date: values.date?.format("YYYY-MM-DD"),
        description: values.description,
        confirmToggle: values.confirmToggle,
        createdAt: new Date().toISOString(),
      };
      prev.push(newLog);
      localStorage.setItem("returnNetLogs", JSON.stringify(prev));
      setReturnNetLogs(prev);
      message.success("विवरण सुरक्षित कर दिया गया");
      setReturnSaving(false);
      setReturnNetOpen(false);
      // lock only this row
      if (returnTarget?.key) {
        setLockedKeys((m) => ({ ...m, [String(returnTarget.key)]: true }));
      }
      setReturnTarget(null);
    } catch {}
  };

  // highlight search
  const highlightSearchText = (text: string, searchText: string) => {
    if (!searchText.trim()) return text;
    const regex = new RegExp(`(${searchText.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => regex.test(part)
      ? <span key={index} className="bg-yellow-200 font-medium">{part}</span>
      : part
    );
  };

  // columns with always-enabled विवरण and disabled others
  const columns: TableProps<DataType>["columns"] = useMemo(
    () => [
      { title: "S.NO", dataIndex: "sno", key: "sno", width: 80, align: "center",
        render: (_t, _r, i) => {
          const pageSize = pagination.pageSize || 10;
          const current = pagination.current || 1;
          return (current - 1) * pageSize + i + 1;
        }
      },
      { title: "जाति", dataIndex: "cast", key: "cast", width: 120, render: (text) => <span className="capitalize">{highlightSearchText(text, searchText)}</span> },
      { title: "नाम", dataIndex: "name", key: "name", width: 150, render: (text) => highlightSearchText(text, searchText) },
      { title: "पिता का नाम", dataIndex: "fathername", key: "fathername", width: 150, render: (text) => highlightSearchText(text, searchText) },
      { title: "गाँव का नाम", dataIndex: "address", key: "address", width: 200, render: (text) => highlightSearchText(text, searchText) },
      { title: "आवता", dataIndex: "aavta", key: "aavta", width: 120, align: "right", render: (v) => highlightSearchText(`₹${(v ?? 0).toLocaleString()}`, searchText) },
      { title: "ऊपर नेत", dataIndex: "uparnet", key: "uparnet", width: 120, align: "right", render: (v) => highlightSearchText(`₹${(v ?? 0).toLocaleString()}`, searchText) },
      {
        title: "कार्य",
        key: "action",
        width: 320,
        align: "center",
        render: (_, record) => {
          const isLocked = !!lockedKeys[record.key];
          return (
            <Space size="small">
              {/* विवरण: always enabled */}
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

              {/* संपादित: disable when locked, wrap for tooltip */}
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

              {/* हटाएं */}
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

              {/* वापस डाला गया नेत */}
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

  // current page slice and totals
  const currentSlice = useMemo(() => {
    const curr = pagination.current ?? 1;
    const size = pagination.pageSize ?? 10;
    const start = (curr - 1) * size;
    const end = start + size;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.current, pagination.pageSize]);

  const { pageAavta, pageUpar, pageTotal } = useMemo(() => {
    const pageAavta = currentSlice.reduce((s, r) => s + (Number(r.aavta) || 0), 0);
    const pageUpar = currentSlice.reduce((s, r) => s + (Number(r.uparnet) || 0), 0);
    return { pageAavta, pageUpar, pageTotal: pageAavta + pageUpar };
  }, [currentSlice]);

  const { totalAavta, totalUpar, grandTotal } = useMemo(() => {
    const totalAavta = filteredData.reduce((s, r) => s + (Number(r.aavta) || 0), 0);
    const totalUpar = filteredData.reduce((s, r) => s + (Number(r.uparnet) || 0), 0);
    return { totalAavta, totalUpar, grandTotal: totalAavta + totalUpar };
  }, [filteredData]);

  // pagination change
  const onChange: TableProps<DataType>["onChange"] = (pg) => {
    setPagination((prev) => ({ ...prev, current: pg.current, pageSize: pg.pageSize }));
  };

  // selected bahee labels
  const selectedBahee = useMemo(() => {
    if (!selectedBaheeType) return null;
    return baheeDetails.find(bd => bd.baheeType === selectedBaheeType) || null;
  }, [selectedBaheeType, baheeDetails]);
  const selectedBaheeName = selectedBahee?.baheeTypeName || "अज्ञात बही";
  const selectedBaheePerson = selectedBahee?.name ? ` - ${selectedBahee.name}` : "";

  // go to bahee list
  const goToBaheeList = (bahee: BaheeDetails) => {
    setSelectedBaheeType(bahee.baheeType);
    localStorage.setItem('currentBaheeContext', bahee.baheeType);
    message.success("सूची पर ले जाया गया");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Contextual Bahee Details */}
        {contextualBaheeDetails.length > 0 && (
          <div className="p-4 bg-blue-50 border-b">
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              {currentBaheeType ? 'वर्तमान बही विवरण:' : 'सहेजी गई बही विवरण:'}
            </h3>
            <div className="flex flex-col gap-2">
              {contextualBaheeDetails.map((bd, index) => (
                <div key={bd.id || index} className="bg-white border border-blue-200 rounded-lg px-4 py-2 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 overflow-x-auto" style={{ whiteSpace: "nowrap" }}>
                    <span className="text-lg">🕉️</span>
                    <span className="font-semibold text-blue-800">{bd.baheeTypeName}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">नाम: <b>{bd.name}</b></span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">तारीख: {bd.date}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sm">तिथि: {bd.tithi}</span>
                  </div>
                  <Space size="small" className="flex-shrink-0">
                    <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => openBaheeView(bd)} className="bg-green-500 hover:bg-green-600" title="देखें">
                      देखें
                    </Button>
                    <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => openBaheeEdit(bd)} className="bg-blue-500 hover:bg-blue-600" title="संपादित करें" />
                    <Button type="default" icon={<UnorderedListOutlined />} size="small" onClick={() => goToBaheeList(bd)} title="बही सूची पर जाएं">
                      सूची
                    </Button>
                  </Space>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Header with Filter, Search */}
        <div className="p-4 border-b">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
              <h2 className="text-xl font-semibold text-gray-800">विगत बही सूची - {selectedBaheeName}{selectedBaheePerson}</h2>
              {!currentBaheeType && baheeTypeOptions.length > 0 && (
                <div className="flex items-center gap-2">
                  <FilterOutlined className="text-blue-500" />
                  <Select value={selectedBaheeType} onChange={handleBaheeTypeChange} className="min-w-[200px]" placeholder="बही प्रकार चुनें">
                    {baheeTypeOptions.map(option => (<Option key={option.value} value={option.value}>{option.label}</Option>))}
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
              <span className="text-blue-700 flex items-center"><SearchOutlined className="mr-1" /> परिणाम:</span>
              <span className="font-semibold text-blue-900">
                {filteredData.length} रिकॉर्ड 
                {selectedBaheeType !== "" ? ` (${selectedBaheeName})` : ""}
                {searchText ? ` "${searchText}" के लिए` : ""}
              </span>
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
          pagination={{ ...pagination, total: filteredData.length, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`, position: ["bottomCenter"] }}
          scroll={{ x: 1100 }}
          size="middle"
          rowClassName={(record) => (lockedKeys[record.key] ? "opacity-60" : "")}
          locale={{
            emptyText: filteredData.length === 0
              ? (selectedBaheeType !== "" ? `${selectedBaheeName} के लिए कोई रिकॉर्ड नहीं मिला`
                  : (searchText ? `"${searchText}" के लिए कोई परिणाम नहीं मिला` : 'कोई डेटा उपलब्ध नहीं है'))
              : 'कोई डेटा उपलब्ध नहीं है'
          }}
        />

        {/* Totals */}
        <div className="px-4 pb-4 space-y-3">
          <div className="w-full rounded-md border bg-gray-50 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm sm:text-base font-medium text-gray-700">इस पेज के कुल ({selectedBaheeName}):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-gray-600">आवता:</span><span className="font-semibold text-red-900">₹{pageAavta.toLocaleString()}</span></div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-gray-600">ऊपर नेत:</span><span className="font-semibold text-red-900">₹{pageUpar.toLocaleString()}</span></div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-gray-600">पेज योग:</span><span className="font-semibold text-red-500">₹{pageTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
          <div className="w-full rounded-md border bg-blue-50 p-3 sm:p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm sm:text-base font-medium text-blue-700">कुल योग ({filteredData.length} रिकॉर्ड - {selectedBaheeName}):</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-blue-600">आवता:</span><span className="font-bold text-blue-900">₹{totalAavta.toLocaleString()}</span></div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-blue-600">ऊपर नेत:</span><span className="font-bold text-blue-900">₹{totalUpar.toLocaleString()}</span></div>
                <div className="flex items-center justify-between sm:justify-start sm:gap-2"><span className="text-blue-600">महाकुल योग:</span><span className="font-bold text-blue-500 text-lg">₹{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Entry Edit Modal */}
      <CommonModal
        open={editOpen}
        title="रिकॉर्ड संपादित करें"
        onOk={saveEdit}
        onCancel={() => { setEditOpen(false); setCurrent(null); form.resetFields(); }}
        okText="सेव करें"
        cancelText="रद्द करें"
        width={720}
        maskClosable={false}
        afterOpenAutoFocus
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

      {/* Bahee Edit Modal - FIXED */}
      <CommonModal
        open={baheeEditOpen}
        title="बही विवरण संपादित करें"
        onOk={saveBaheeEdit}
        onCancel={closeBaheeModals}
        okText="सेव करें"
        cancelText="रद्द करें"
        width={720}
        maskClosable={false}
      >
        <BaheeEditForm form={baheeForm} initialValues={currentBahee || undefined} />
      </CommonModal>

      {/* Entry View Details Modal (Row विवरण) - UPDATED WITH RETURN NET INFO */}
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
            {/* Locked info banner when row is locked */}
            {lockedKeys[viewModal.record.key] && (
              <div className="rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
                ⚠️ यह प्रविष्टि लॉक है; केवल विवरण देखा जा सकता है।
              </div>
            )}
            
            {/* Basic Entry Details */}
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
        onCancel={() => { setReturnNetOpen(false); setReturnSaving(false); setReturnTarget(null); returnNetForm.resetFields(); }}
        okText={<><SaveOutlined /> सहेजें</>}
        cancelText="रद्द करें"
        width={640}
        maskClosable={false}
        confirmLoading={returnSaving}
      >
        <Form form={returnNetForm} layout="vertical" disabled={returnSaving}>
          <Form.Item name="name" label="नाम" rules={[{ required: true, message: 'नाम दर्ज करें' }]}>
            <ReactTransliterate lang="hi" placeholder="नाम दर्ज करें" className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm" style={{ height: 40 }} />
          </Form.Item>
          <Form.Item name="date" label="तारीख" rules={[{ required: true, message: 'तारीख चुनें' }]}>
            <DatePicker format="YYYY-MM-DD" className="w-full" placeholder="तारीख चुनें" />
          </Form.Item>
          <Form.Item name="description" label="विवरण" rules={[{ required: true, message: 'विवरण दर्ज करें' }]}>
            <ReactTransliterate renderComponent={(props: any) => (<TextArea {...props} rows={4} />)} lang="hi" placeholder="विवरण लिखें..." className="w-full" />
          </Form.Item>
          <Form.Item name="confirmToggle" label="पुष्टि" valuePropName="checked" rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject(new Error('कृपया टॉगल ऑन करें')) }]}>
            <Switch checkedChildren="हाँ" unCheckedChildren="नहीं" />
          </Form.Item>
        </Form>
      </CommonModal>
    </>
  );
};

export default AddNewEntriesInterface;
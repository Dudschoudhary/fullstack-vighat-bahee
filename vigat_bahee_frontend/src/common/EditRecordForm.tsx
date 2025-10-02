import React, { useEffect, useState } from "react";
import { Form, InputNumber, Row, Col } from "antd";
import { ReactTransliterate } from 'react-transliterate';
import 'react-transliterate/dist/index.css';

export interface EditValues {
  cast: string;
  name: string;
  fathername: string;
  address: string;
  aavta: number;
  uparnet: number;
}

interface EditRecordFormProps {
  initialValues?: Partial<EditValues>;
  form: any; // AntD FormInstance
  // ✅ NEW: Add props for toggle functionality
  isAnyaBahee?: boolean;
  currentRecord?: any;
  onToggleChange?: (enabled: boolean) => void;
}

const parseMoney = (v: any) => Number((v || "").toString().replace(/[₹,\s]/g, ""));

// Custom Transliterate Input Component for Antd Form
const TransliterateFormInput: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value = "", onChange, placeholder, className = "" }) => {
  return (
    <ReactTransliterate
      value={value}
      onChangeText={(text: string) => onChange?.(text)}
      lang="hi"
      placeholder={placeholder}
      className={`ant-input ${className}`}
      style={{
        width: '100%',
        height: '32px',
        padding: '4px 11px',
        fontSize: '14px',
        lineHeight: '1.5715',
        color: 'rgba(0, 0, 0, 0.85)',
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        transition: 'all 0.2s',
        fontFamily: 'inherit'
      }}
    />
  );
};

const EditRecordForm: React.FC<EditRecordFormProps> = ({ 
  initialValues, 
  form,
  isAnyaBahee = false,
  currentRecord,
  onToggleChange
}) => {
  // ✅ NEW: Toggle state for "anya" bahee entries
  const [uparnetToggle, setUparnetToggle] = useState<boolean>(true);

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
    
    // ✅ NEW: Set toggle based on current record uparnet value
    if (isAnyaBahee && currentRecord) {
      const hasUparnet = currentRecord.uparnet > 0;
      setUparnetToggle(hasUparnet);
    }
  }, [initialValues, form, isAnyaBahee, currentRecord]);

  // ✅ NEW: Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setUparnetToggle(checked);
    if (onToggleChange) {
      onToggleChange(checked);
    }
    
    // Clear uparnet field when disabled
    if (!checked) {
      form.setFieldValue('uparnet', 0);
    }
  };

  // ✅ FIXED: Check if uparnet should be disabled
  const getUparnetDisabledState = () => {
    if (isAnyaBahee) {
      return !uparnetToggle; // For anya bahee, disabled based on toggle
    }
    
    // ✅ FIXED: For other bahee types, check if they should be disabled
    const baheeType = currentRecord?.baheeType?.toLowerCase() || '';
    const disabledTypes = ['odhawani', 'mahera']; // Remove 'anya' from here
    return disabledTypes.includes(baheeType);
  };

  const isUparnetDisabled = getUparnetDisabledState();

  return (
    <div>
      {/* ✅ NEW: Toggle for "anya" bahee type */}
      {/* {isAnyaBahee && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-blue-800">ऊपर नेत एडिट सेटिंग</h3>
              <p className="text-sm text-blue-600">
                ऊपर नेत फील्ड को enable/disable करें
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={uparnetToggle}
                onChange={(e) => handleToggleChange(e.target.checked)}
                className="sr-only"
              />
              <div className={`relative inline-block w-12 h-6 transition-colors duration-200 ease-in-out rounded-full ${
                uparnetToggle ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                  uparnetToggle ? 'transform translate-x-6' : ''
                }`}></div>
              </div>
              <span className={`ml-2 text-sm font-medium ${uparnetToggle ? 'text-green-700' : 'text-gray-600'}`}>
                {uparnetToggle ? 'Enable' : 'Disable'}
              </span>
            </label>
          </div>
        </div>
      )} */}

      <Form form={form} layout="vertical" name="editRecordForm" preserve={false}>
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  जाति 
                  
                </span>
              }
              name="cast"
              rules={[{ required: true, message: "जाति दर्ज करें" }]}
            >
              <TransliterateFormInput placeholder="ब्राह्मण" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  नाम 
                  
                </span>
              }
              name="name"
              rules={[{ required: true, message: "नाम दर्ज करें" }]}
            >
              <TransliterateFormInput placeholder="रमेश" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  पिता का नाम 
                  
                </span>
              }
              name="fathername"
              rules={[{ required: true, message: "पिता का नाम दर्ज करें" }]}
            >
              <TransliterateFormInput placeholder="सुरेश" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  गाँव का नाम 
                  
                </span>
              }
              name="address"
              rules={[{ required: true, message: "गाँव का नाम दर्ज करें" }]}
            >
              <TransliterateFormInput placeholder="जयपुर" />
            </Form.Item>
          </Col>

          {/* Always side-by-side on all screens */}
          <Col xs={12} md={12}>
            <Form.Item
              label="आवता"
              name="aavta"
              rules={[
                { required: true, message: "आवता दर्ज करें" },
                { type: "number", message: "सही संख्या दर्ज करें" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={parseMoney}
                placeholder="आवता"
              />
            </Form.Item>
          </Col>

          <Col xs={12} md={12}>
            <Form.Item
              label={
                <div className="flex items-center gap-2">
                  <span>ऊपर नेत</span>
                  {/* ✅ Show appropriate helper text */}
                  {isAnyaBahee && !uparnetToggle && (
                    <span className="text-orange-600 text-xs">(इस बही प्रकार के लिए लागू नहीं)</span>
                  )}
                  {!isAnyaBahee && isUparnetDisabled && (
                    <span className="text-orange-600 text-xs">(इस बही प्रकार के लिए लागू नहीं)</span>
                  )}
                </div>
              }
              name="uparnet"
              rules={[
                { required: !isUparnetDisabled, message: "ऊपर नेत दर्ज करें" },
                { type: "number", message: "सही संख्या दर्ज करें" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={parseMoney}
                placeholder={isUparnetDisabled ? "लागू नहीं" : "ऊपर नेत"}
                disabled={isUparnetDisabled}
                style={{
                  backgroundColor: isUparnetDisabled ? '#f5f5f5' : '#fff',
                  cursor: isUparnetDisabled ? 'not-allowed' : 'default'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditRecordForm;
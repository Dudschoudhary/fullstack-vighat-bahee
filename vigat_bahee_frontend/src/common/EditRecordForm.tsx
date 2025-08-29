import React, { useEffect } from "react";
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

const EditRecordForm: React.FC<EditRecordFormProps> = ({ initialValues, form }) => {
  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, form]);

  return (
    <div>
      <Form form={form} layout="vertical" name="editRecordForm" preserve={false}>
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  जाति 
                  <span className="text-blue-500 text-xs ml-2"></span>
                </span>
              }
              name="cast"
              rules={[{ required: true, message: "जाति आवश्यक है" }]}
            >
              <TransliterateFormInput placeholder="जाति (जैसे: brahmin)" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  नाम 
                  <span className="text-blue-500 text-xs ml-2"></span>
                </span>
              }
              name="name"
              rules={[{ required: true, message: "नाम आवश्यक है" }]}
            >
              <TransliterateFormInput placeholder="नाम (जैसे: ramesh)" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  पिता का नाम 
                  <span className="text-blue-500 text-xs ml-2"></span>
                </span>
              }
              name="fathername"
              rules={[{ required: true, message: "पिता का नाम आवश्यक है" }]}
            >
              <TransliterateFormInput placeholder="पिता का नाम (जैसे: suresh)" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span>
                  गाँव का नाम 
                  <span className="text-blue-500 text-xs ml-2"></span>
                </span>
              }
              name="address"
              rules={[{ required: true, message: "गाँव का नाम आवश्यक है" }]}
            >
              <TransliterateFormInput placeholder="गाँव का नाम (जैसे: jaipur)" />
            </Form.Item>
          </Col>

          {/* Always side-by-side on all screens */}
          <Col xs={12} md={12}>
            <Form.Item
              label="आवता"
              name="aavta"
              rules={[
                { required: true, message: "आवता आवश्यक है" },
                { type: "number", message: "मान्य संख्या दर्ज करें" },
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
              label="ऊपर नेत"
              name="uparnet"
              rules={[
                { required: true, message: "ऊपर नेत आवश्यक है" },
                { type: "number", message: "मान्य संख्या दर्ज करें" },
              ]}
            >
              <InputNumber
                className="w-full"
                min={0}
                formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={parseMoney}
                placeholder="ऊपर नेत"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default EditRecordForm;

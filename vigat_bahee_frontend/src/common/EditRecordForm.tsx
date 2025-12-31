import React, { useEffect, useState } from "react";
import { Form, InputNumber, Row, Col, Input, DatePicker } from "antd";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import "../App.css";

export interface EditValues {
  cast: string;
  name: string;
  fathername: string;
  address: string;
  aavta: number;
  uparnet: number;
  isLocked?: boolean;
}

interface EditRecordFormProps {
  initialValues?: Partial<EditValues>;
  form: any;
  isAnyaBahee?: boolean;
  currentRecord?: any;
}

const parseMoney = (v: any) =>
  Number((v || "").toString().replace(/[₹,\s]/g, ""));

/* Transliterate Input */
const TransliterateFormInput: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value = "", onChange, placeholder, className = "" }) => (
  <ReactTransliterate
    value={value}
    onChangeText={(text: string) => onChange?.(text)}
    lang="hi"
    placeholder={placeholder}
    className={`ant-input ${className}`}
  />
);

const EditRecordForm: React.FC<EditRecordFormProps> = ({
  initialValues,
  form,
  isAnyaBahee = false,
  currentRecord,
}) => {
  const [uparnetToggle, setUparnetToggle] = useState<boolean>(true);

  const [isLocked, setIsLocked] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue(initialValues || {});

    if (isAnyaBahee && currentRecord) {
      setUparnetToggle(currentRecord.uparnet > 0);
    }

    // 🔒 lock sync
    if (currentRecord?.isLocked !== undefined) {
      setIsLocked(currentRecord.isLocked);
      form.setFieldValue("isLocked", currentRecord.isLocked);
    }
  }, [initialValues, currentRecord, form, isAnyaBahee]);

  const handleLockToggle = (checked: boolean) => {
    setIsLocked(checked);
    form.setFieldValue("isLocked", checked);
  };

  const getUparnetDisabledState = () => {
    if (isAnyaBahee) return !uparnetToggle;
    const baheeType = currentRecord?.baheeType?.toLowerCase() || "";
    return ["odhawani", "mahera"].includes(baheeType);
  };

  const isUparnetDisabled = getUparnetDisabledState();


  return (
    <div className="exact-form-wrapper">
      <Form form={form} layout="vertical" preserve={false} className="exact-form">
        <Row gutter={[16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item name="cast" label="जाति" rules={[{ required: true }]}>
              <TransliterateFormInput placeholder="ब्राह्मण" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="name" label="नाम" rules={[{ required: true }]}>
              <TransliterateFormInput placeholder="रमेश" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="fathername"
              label="पिता का नाम"
              rules={[{ required: true }]}
            >
              <TransliterateFormInput placeholder="सुरेश" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="address"
              label="गाँव का नाम"
              rules={[{ required: true }]}
            >
              <TransliterateFormInput placeholder="जयपुर" />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item name="aavta" label="आवता" rules={[{ required: true }]}>
              <InputNumber
                className="w-full"
                min={0}
                formatter={(v) => `₹ ${v}`}
                parser={parseMoney}
              />
            </Form.Item>
          </Col>

          <Col xs={12}>
            <Form.Item
              name="uparnet"
              label="ऊपर नेत"
              rules={[{ required: !isUparnetDisabled }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                disabled={isUparnetDisabled}
                formatter={(v) => `₹ ${v}`}
                parser={parseMoney}
              />
            </Form.Item>
          </Col>


          {/* 🔒 HIDDEN FIELD */}
          <Form.Item name="isLocked" hidden>
            <input />
          </Form.Item>
        </Row>

        {isLocked && (
          <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
            <Row gutter={[16, 12]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="लॉक तारीख"
                  name="lockDate"
                  rules={[{ required: true, message: "तारीख चुनें" }]}
                >
                  <DatePicker
                    className="w-full"
                    format="DD-MM-YYYY"
                    disabled={!!currentRecord?.isLocked}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="लॉक विवरण"
                  name="lockDescription"
                  rules={[{ required: true, message: "विवरण लिखें" }]}
                >
                  <Input.TextArea
                    rows={3}
                    placeholder="लॉक करने का कारण लिखें"
                    disabled={!!currentRecord?.isLocked}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        )}


        <div
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#fafafa",
          }}
        >
          <div>
            <strong className="text-red-600">रिकॉर्ड लॉक</strong>
            <div className="text-md text-blue-700" >
              लॉक होने पर रिकॉर्ड edit नहीं किया जा सकेगा
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => handleLockToggle(e.target.checked)}
              style={{ display: "none" }}
            />

            <div
              style={{
                width: 44,
                height: 22,
                borderRadius: 11,
                background: isLocked ? "#ef4444" : "#22c55e",
                position: "relative",
                transition: "0.3s",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  top: 2,
                  left: isLocked ? 24 : 2,
                  transition: "0.3s",
                }}
              />
            </div>

            <span
              style={{
                marginLeft: 10,
                fontWeight: 600,
                color: isLocked ? "#ef4444" : "#16a34a",
              }}
            >
              {isLocked ? "लॉक हटाएँ" : "लॉक करें"}
            </span>
          </label>
        </div>
      </Form>
    </div>
  );
};

export default EditRecordForm;
// components/AddNewEntriesInterface/components/BaheeEditForm.tsx
import React, { useState, useEffect } from 'react';
import { Form, DatePicker } from 'antd';
import { ReactTransliterate } from 'react-transliterate';
import type { BaheeDetails } from '../types/bahee.types';

interface Props {
  form: any;
  initialValues?: BaheeDetails;
}

const BaheeEditForm: React.FC<Props> = ({ form }) => {
  const [formData, setFormData] = useState({
    baheeTypeName: '',
    name: '',
    tithi: ''
  });

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
      <Form.Item 
        name="baheeTypeName" 
        label="बही प्रकार नाम" 
        rules={[{ required: true, message: 'बही प्रकार नाम दर्ज करें' }]}
      >
        <ReactTransliterate
          value={formData.baheeTypeName}
          onChangeText={(text: string) => handleFieldChange('baheeTypeName', text)}
          lang="hi"
          placeholder="बही प्रकार नाम दर्ज करें"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ height: '40px' }}
        />
      </Form.Item>
      
      <Form.Item 
        name="name" 
        label="नाम" 
        rules={[{ required: true, message: 'नाम दर्ज करें' }]}
      >
        <ReactTransliterate
          value={formData.name}
          onChangeText={(text: string) => handleFieldChange('name', text)}
          lang="hi"
          placeholder="नाम दर्ज करें"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          style={{ height: '40px' }}
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
        name="tithi" 
        label="तिथि" 
        rules={[{ required: true, message: 'तिथि दर्ज करें' }]}
      >
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

export default BaheeEditForm;
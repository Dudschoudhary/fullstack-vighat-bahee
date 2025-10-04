// components/ConfirmModal.tsx
import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  content: any;
  onCancel: () => void;
  loading?: boolean;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onOk?: () => void;
  okText?: string;
  okType?: string;
  confirmLoading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  content,
  onCancel,
  loading = false,
  confirmText = "Yes",
  cancelText = "No",
  danger = false,
  onOk
}) => {
  return (
    <Modal
      open={open}
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined 
            className={`text-lg ${danger ? 'text-red-500' : 'text-orange-500'}`} 
          />
          {title}
        </div>
      }
      onCancel={onCancel}
      onOk={onOk}
      width={400}
      centered
      okText={''}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger={danger}
          loading={loading}
          onClick={onOk}
          className={danger ? "bg-red-500 hover:bg-red-600" : ""}
        >
          {confirmText}
        </Button>,
      ]}
    >
      <div className="py-4">
        <p className="text-gray-700">{content}</p>
      </div>
    </Modal>
  );
};

export default ConfirmModal;    
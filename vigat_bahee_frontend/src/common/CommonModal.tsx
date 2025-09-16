import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";

export interface CommonModalProps {
  open: boolean;
  title?: React.ReactNode;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
  okText?: any;
  cancelText?: string;
  width?: number | string;
  centered?: boolean;
  keyboard?: boolean;
  maskClosable?: boolean;
  destroyOnClose?: boolean;
  closable?: boolean;
  footer?: React.ReactNode | null;
  confirmLoading?: boolean;
  afterOpenAutoFocus?: boolean;
  preserveChildren?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: React.ReactNode;
  cancelButtonProps?: any
}

const CommonModal: React.FC<CommonModalProps> = React.memo((props) => {
  const {
    open,
    title,
    onOk,
    onCancel,
    okText = "Save",
    cancelText = "Cancel",
    width = 600,
    centered = true,
    keyboard = true,
    maskClosable = false,
    destroyOnClose = true,
    closable = true,
    footer,
    confirmLoading,
    afterOpenAutoFocus = true,
    preserveChildren = false,
    className,
    bodyClassName,
    children,
  } = props;

  const [internalLoading, setInternalLoading] = useState(false);
  const okLoading = useMemo(
    () => (typeof confirmLoading === "boolean" ? confirmLoading : internalLoading),
    [confirmLoading, internalLoading]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !afterOpenAutoFocus) return;
    const t = setTimeout(() => {
      const root =
        containerRef.current ||
        (document.querySelector(".ant-modal-body") as HTMLElement | null);
      if (!root) return;
      const el = root.querySelector<HTMLElement>(
        'input,select,textarea,button,[tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [open, afterOpenAutoFocus]);

  const handleOk = async () => {
    if (!onOk) return;
    if (typeof confirmLoading === "boolean") {
      await onOk();
      return;
    }
    try {
      setInternalLoading(true);
      await onOk();
    } finally {
      setInternalLoading(false);
    }
  };

  const effectiveDestroy = preserveChildren ? false : destroyOnClose;

  return (
    <Modal
      open={open}
      title={title}
      onOk={onOk ? handleOk : undefined}
      onCancel={okLoading ? undefined : onCancel}
      okText={okText}
      cancelText={cancelText}
      width={width}
      centered={centered}
      keyboard={keyboard}
      maskClosable={okLoading ? false : maskClosable}
      destroyOnClose={effectiveDestroy}
      closable={closable && !okLoading}
      confirmLoading={okLoading}
      footer={footer}
      className={className}
      modalRender={(node) => (
        <div ref={containerRef} className={bodyClassName}>{node}</div>
      )}
    >
      {children}
    </Modal>
  );
});

CommonModal.displayName = "CommonModal";
export default CommonModal;

"use client";

import { useEffect } from "react";
import "./styles/modal.css";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  className = "",
  showCloseButton = true,
  closeOnOverlay = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={closeOnOverlay ? onClose : undefined}
      style={{ position: "fixed", zIndex: 9999 }}
    >
      <div
        className={`modal modal-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="modal-header">
            {title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button className="modal-close-btn" onClick={onClose}>
                <span className="close-icon">×</span>
              </button>
            )}
          </div>
        )}

        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

const ModalFooter = ({ children, className = "" }) => {
  return <div className={`modal-footer ${className}`}>{children}</div>;
};

Modal.Footer = ModalFooter;

export default Modal;

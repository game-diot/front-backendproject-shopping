import React from "react";
import "./ConfirmModal.css"; // 我们将为这个模态框添加一些基本的 CSS

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-button confirm" onClick={onConfirm}>
            确定
          </button>
          <button className="modal-button cancel" onClick={onCancel}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

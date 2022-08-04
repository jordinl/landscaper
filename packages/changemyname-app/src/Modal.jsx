import React from "react";
import { Modal as RSuiteModal } from "rsuite";

const imgStyle = {
  maxWidth: 250,
};

const Modal = ({ item, onClose }) => {
  const path = [item.category.name, item.subcategory && item.subcategory.name]
    .filter((_) => _)
    .join(" / ");
  return (
    <RSuiteModal size="lg" open={true} onClose={onClose}>
      <RSuiteModal.Header />
      <RSuiteModal.Body style={{ minHeight: 500, display: "flex" }}>
        <div style={{ width: "33%" }}>
          <img src={item.logo} style={imgStyle} />
        </div>
        <div>
          <div>
            <h1>{item.name}</h1>
            <h5>{path}</h5>
          </div>
          <div>{item.description}</div>
        </div>
      </RSuiteModal.Body>
    </RSuiteModal>
  );
};

export default Modal;

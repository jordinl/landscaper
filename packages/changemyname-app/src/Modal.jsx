import React from "react";
import { Modal as RSuiteModal } from "rsuite";

const imgStyle = {
  maxWidth: 250,
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
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
          {item.info &&
            item.info.map(({ text, url, label, format }) => {
              const textOrUrl =
                text ||
                (url &&
                  url.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, ""));
              const formattedText =
                format === "date" ? formatDate(textOrUrl) : textOrUrl;
              return (
                <div key={label}>
                  <span>{label}:</span>
                  <span>
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer noopener">
                        {formattedText}
                      </a>
                    ) : (
                      formattedText
                    )}
                  </span>
                </div>
              );
            })}
        </div>
      </RSuiteModal.Body>
    </RSuiteModal>
  );
};

export default Modal;

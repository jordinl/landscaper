import React, { Fragment } from "react";
import RSuiteModal from "rsuite/Modal";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const Modal = ({ item, onClose }) => {
  const path = [item.category.name, item.subcategory && item.subcategory.name]
    .filter((_) => _)
    .join(" / ");
  const className = [
    "modal-image",
    item.variant && `landscape-item-variant-${item.variant}`,
  ]
    .filter((_) => _)
    .join(" ");
  return (
    <RSuiteModal size="lg" open={true} onClose={onClose}>
      <RSuiteModal.Header />
      <RSuiteModal.Body>
        <div className="modal-left-column">
          <div className={className}>
            <div className="landscape-item-body">
              <img src={item.logo} />
            </div>
          </div>
        </div>
        <div>
          <div>
            <h1>{item.name}</h1>
          </div>
          <div>
            <h4>{path}</h4>
          </div>
          <div className="margin-top description">{item.description}</div>
          <div className="margin-top links">
            {item.info &&
              item.info.map(({ text, url, label, format }) => {
                const textOrUrl =
                  text ||
                  (url &&
                    url.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, ""));
                const formattedText =
                  format === "date" ? formatDate(textOrUrl) : textOrUrl;
                return (
                  <Fragment key={label}>
                    <span className="item-label">{label}</span>
                    <span>
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer noopener">
                          {formattedText}
                        </a>
                      ) : (
                        formattedText
                      )}
                    </span>
                  </Fragment>
                );
              })}
          </div>
        </div>
      </RSuiteModal.Body>
    </RSuiteModal>
  );
};

export default Modal;

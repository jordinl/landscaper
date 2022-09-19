import React from "react";

const ContentColumns = ({ items, prefix }) => {
  const itemsCount = Object.keys(items).length;
  const baseClass = `landscape-content-columns`;

  const classes = Object.keys(items)
    .map((key) => `has-${key}`)
    .join(" ");

  return (
    <div
      className={`landscape-${prefix}-body ${baseClass}-body ${baseClass}-items-${itemsCount} ${classes}`}
    >
      {["left", "center", "right"].map((key, idx) => {
        const child = items && items[key];
        if (!child) {
          return null;
        }
        const itemBaseClass = `${baseClass}-item ${baseClass}-item-${key} ${baseClass}-item-`;

        if (child.type === "image") {
          return (
            <div key={idx} className={`${itemBaseClass}image`}>
              <img src={child.src} />
            </div>
          );
        } else if (child.type === "html") {
          const __html = child.content;
          return (
            <div
              key={idx}
              dangerouslySetInnerHTML={{ __html }}
              className={`${itemBaseClass}html`}
            />
          );
        } else {
          return (
            <div key={idx} className={`${itemBaseClass}other`}>
              {child.content}
            </div>
          );
        }
      })}
    </div>
  );
};

export default ContentColumns;

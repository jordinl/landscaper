import React from "react";

const Header = ({ header }) => {
  const itemsCount = Object.keys(header).length;

  const classes = Object.keys(header)
    .map((key) => `has-${key}`)
    .join(" ");
  return (
    <div
      className={`landscape-header-body landscape-header-items-${itemsCount} ${classes}`}
    >
      {["left", "center", "right"].map((key, idx) => {
        const child = header && header[key];
        if (!child) {
          return null;
        }
        const baseClassName = `landscape-header-item landscape-header-item-${key} landscape-header-item-`;

        if (child.type === "image") {
          return (
            <div key={idx} className={`${baseClassName}image`}>
              <img src={child.src} />
            </div>
          );
        } else if (child.type === "html") {
          const __html = child.content;
          return (
            <div
              key={idx}
              dangerouslySetInnerHTML={{ __html }}
              className={`${baseClassName}html`}
            />
          );
        } else {
          return (
            <div key={idx} className={`${baseClassName}other`}>
              {child.content}
            </div>
          );
        }
      })}
    </div>
  );
};

export default Header;

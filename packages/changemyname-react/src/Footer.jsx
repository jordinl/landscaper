import React from "react";

const Footer = ({ footer }) => {
  return (
    <div className="landscape-footer">
      {footer.map((item, idx) => {
        return (
          <div
            key={idx}
            className="landscape-footer-item"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        );
      })}
    </div>
  );
};

export default Footer;

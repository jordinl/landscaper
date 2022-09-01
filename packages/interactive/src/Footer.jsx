import React from "react";

const Footer = ({ footer }) => {
  return (
    <>
      {footer.map((item, idx) => {
        return (
          <div
            key={idx}
            className="landscape-footer-item"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        );
      })}
    </>
  );
};

export default Footer;

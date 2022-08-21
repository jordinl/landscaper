import React from "react";
import "./Landscape.css";
import Footer from "./Footer.jsx";
import VerticalCategory from "./VerticalCategory";

const DefaultLinkComponent = ({ to, children, ...rest }) => {
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
};

const Landscape = ({
  zoom = 1,
  footer,
  categories,
  Header,
  LinkComponent = DefaultLinkComponent,
}) => {
  const elements = categories.map((category, idx) => {
    return (
      <VerticalCategory
        {...category}
        subcategories={category.subcategories}
        key={idx}
        className={`landscape-category-${idx}`}
        LinkComponent={LinkComponent}
      />
    );
  });

  const style = {
    transform: `scale(${zoom})`,
  };

  return (
    <div style={style} className="landscape">
      {Header && <div className="landscape-header">{Header}</div>}
      <div className="landscape-categories">{elements}</div>
      {footer && <Footer footer={footer} />}
    </div>
  );
};

export default Landscape;

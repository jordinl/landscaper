import React from "react";
import "./Landscape.css";
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
  categories,
  header,
  footer,
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
      {header && <div className="landscape-header">{header}</div>}
      <div className="landscape-categories">{elements}</div>
      {footer && <div className="landscape-footer">{footer}</div>}
    </div>
  );
};

export default Landscape;

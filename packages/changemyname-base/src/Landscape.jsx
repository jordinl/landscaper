import React from "react";
import "./Landscape.css";
import VerticalCategory from "./VerticalCategory";
import {
  headerHeight,
  outerPadding,
  calculateVerticalCategory,
  footerHeight,
} from "./utils/landscapeCalculations";

const DefaultLinkComponent = ({ to, children, ...rest }) => {
  return (
    <a href={to} {...rest}>
      {children}
    </a>
  );
};

const Landscape = ({
  zoom = 1,
  header,
  footer,
  categories,
  LinkComponent = DefaultLinkComponent,
}) => {
  const verticalCategories = calculateVerticalCategory({
    categories,
    header,
    footer,
  });
  const width =
    verticalCategories.reduce((sum, { width }) => sum + width, 0) +
    (verticalCategories.length + 1) * outerPadding;

  const elements = verticalCategories.map((category, idx) => {
    return (
      <VerticalCategory
        {...category.style}
        {...category}
        subcategories={category.subcategories}
        key={idx}
        LinkComponent={LinkComponent}
      />
    );
  });

  const style = {
    padding: outerPadding,
    transform: `scale(${zoom})`,
    gap: outerPadding,
    width,
  };

  const headerStyle = {
    height: headerHeight,
  };

  const footerStyle = {
    height: footerHeight,
  };

  return (
    <div style={style} className="landscape">
      {header && (
        <div className="landscape--header" style={headerStyle}>
          <div style={{ width: "25%" }}>
            {header.logo && (
              <img style={{ height: "100%" }} src={header.logo} />
            )}
          </div>
          <div
            style={{
              width: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {header.title && (
              <h1 style={{ fontSize: 26, lineHeight: "26px" }}>
                {header.title}
              </h1>
            )}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: outerPadding,
        }}
      >
        {elements}
      </div>
      {footer && (
        <div className="landscape--footer" style={footerStyle}>
          {footer.map((item) => {
            return (
              <div className="landscape--footer--item">
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Landscape;

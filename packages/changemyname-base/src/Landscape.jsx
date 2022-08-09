import React from "react";
import VerticalCategory from "./VerticalCategory";
import {
  headerHeight,
  outerPadding,
  calculateVerticalCategory,
  footerHeight,
} from "./utils/landscapeCalculations";

const Landscape = ({
  zoom = 1,
  header,
  footer,
  categories,
  LinkComponent = "a",
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
    transformOrigin: "0 0",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: outerPadding,
    width,
  };

  const headerStyle = {
    height: headerHeight,
    display: "flex",
    color: "white",
    justifyContent: "flex-start",
    alignItems: "stretch",
  };

  const footerStyle = {
    height: footerHeight,
    display: "flex",
    color: "white",
    justifyContent: "center",
    alignItems: "stretch",
  };

  const footerItemStyle = {
    display: "flex",
    alignItems: "center",
  };

  return (
    <div style={style}>
      {header && (
        <div className="header" style={headerStyle}>
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
        <div className="footer" style={footerStyle}>
          {footer.map((item) => {
            return (
              <div style={footerItemStyle}>
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

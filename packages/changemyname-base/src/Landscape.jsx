import React from "react";
import HorizontalCategory from "./HorizontalCategory";
import VerticalCategory from "./VerticalCategory";
import {
  calculateSize,
  headerHeight,
  outerPadding,
} from "./utils/landscapeCalculations";

const Landscape = ({ zoom = 1, header, categories, LinkComponent = "a" }) => {
  const { width, height } = calculateSize(categories, header);

  const elements = categories.map((category, idx) => {
    const Component =
      category.style.layout === "horizontal"
        ? HorizontalCategory
        : VerticalCategory;
    return (
      <Component
        {...category}
        {...category.style}
        subcategories={category.subcategories}
        key={idx}
        LinkComponent={LinkComponent}
      />
    );
  });

  const style = {
    padding: outerPadding,
    width: width + 2 * outerPadding,
    height: height + 2 * outerPadding,
    transform: `scale(${zoom})`,
    transformOrigin: "0 0",
    boxSizing: "border-box",
  };

  const headerStyle = {
    height: headerHeight,
    display: "flex",
    color: "white",
    justifyContent: "flex-start",
    alignItems: "stretch",
    marginBottom: outerPadding,
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
      <div style={{ position: "relative" }}>{elements}</div>
    </div>
  );
};

export default Landscape;

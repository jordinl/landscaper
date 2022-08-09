import React from "react";
import Item from "./Item";
import {
  categoryTitleHeight,
  itemMargin,
  smallItemWidth,
  subcategoryMargin,
  categoryBorder,
} from "./utils/landscapeCalculations";
import CategoryHeader from "./CategoryHeader";

const VerticalCategory = ({
  name,
  subcategories,
  color,
  href,
  LinkComponent,
  width,
  columns,
}) => {
  return (
    <div
      style={{
        background: "#0086FF",
        boxShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.2)",
        padding: categoryBorder,
        display: "flex",
        flexDirection: "column",
        width,
      }}
      className="big-picture-section"
    >
      <div
        style={{
          height: categoryTitleHeight,
          width: "100%",
          display: "flex",
        }}
      >
        <CategoryHeader href={href} label={name} background={color} />
      </div>
      <div
        style={{
          padding: `${subcategoryMargin}px ${itemMargin}px`,
          background: "white",
          flex: 1,
          display: "flex",
          gap: 2 * itemMargin,
          flexDirection: "column",
        }}
      >
        {subcategories.map((subcategory) => {
          const { name } = subcategory;

          return (
            <div key={subcategory.name}>
              <div style={{ lineHeight: "15px", textAlign: "center" }}>
                <span>{name}</span>
              </div>

              <div
                style={{
                  overflow: "hidden",
                  display: "grid",
                  gap: itemMargin,
                  gridTemplateColumns: `repeat(${Math.min(
                    columns,
                    subcategory.itemsCount
                  )}, ${smallItemWidth}px)`,
                  justifyContent: "center",
                }}
              >
                {subcategory.items.map((item) => (
                  <Item
                    item={item}
                    key={item.name}
                    LinkComponent={LinkComponent}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalCategory;

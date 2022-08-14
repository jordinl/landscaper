import React from "react";
import Item from "./Item";
import {
  categoryTitleHeight,
  itemMargin,
  smallItemWidth,
  subcategoryMargin,
  categoryBorder,
} from "./utils/landscapeCalculations";

const VerticalCategory = ({
  name,
  subcategories,
  LinkComponent,
  width,
  columns,
}) => {
  return (
    <div
      style={{ padding: categoryBorder, width }}
      className="landscape--vertical--category"
    >
      <div
        className="landscape--vertical--category--header"
        style={{ height: categoryTitleHeight }}
      >
        {name}
      </div>
      <div
        className="landscape--vertical--category--body"
        style={{
          padding: `${subcategoryMargin}px ${itemMargin}px`,
          gap: 2 * itemMargin,
        }}
      >
        {subcategories.map((subcategory) => {
          const { name } = subcategory;

          return (
            <div className="landscape--subcategory" key={subcategory.name}>
              <div className="landscape--subcategory--title">
                <span>{name}</span>
              </div>

              <div
                className="landscape--subcategory--body"
                style={{
                  gap: itemMargin,
                  gridTemplateColumns: `repeat(${Math.min(
                    columns,
                    subcategory.itemsCount
                  )}, ${smallItemWidth}px)`,
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

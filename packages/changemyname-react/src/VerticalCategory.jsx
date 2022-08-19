import React from "react";
import Item from "./Item";

const VerticalCategory = ({
  name,
  subcategories,
  LinkComponent,
  className,
}) => {
  return (
    <div className={`landscape-category ${className}`}>
      <div className="landscape-category-header">{name}</div>
      <div className="landscape-category-body">
        {subcategories.map((subcategory) => {
          const { name } = subcategory;

          return (
            <div className="landscape-subcategory" key={subcategory.name}>
              <div className="landscape-subcategory-title">
                <span>{name}</span>
              </div>

              <div className="landscape-subcategory-body">
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

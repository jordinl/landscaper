import React from "react";
import { CheckTreePicker, Slider } from "rsuite";

const Sidebar = ({
  filters,
  zoom,
  searchParams,
  resetFilters,
  onChangeSearchParam,
  selectedFilters,
}) => {
  const getValue = (name) => {
    const value = searchParams.has(name) && searchParams.get(name);
    return value ? value.split(",") : [];
  };
  return (
    <div className="sidebar">
      {filters && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {filters.map((filter) => (
            <CheckTreePicker
              data={filter.options}
              onChange={(values) => onChangeSearchParam(filter.name, values)}
              defaultExpandAll={true}
              placeholder={`Select ${filter.label}`}
              key={filter.name}
              preventOverflow={true}
              value={getValue(filter.name)}
            />
          ))}

          {selectedFilters.length > 0 && (
            <a onClick={resetFilters} href="#" style={{ textAlign: "right" }}>
              Reset Filters
            </a>
          )}
        </div>
      )}
      <Slider
        min={100}
        max={400}
        step={10}
        value={zoom}
        style={{ margin: "5px 10px" }}
        tooltip={false}
        onChange={(value) => onChangeSearchParam("zoom", value > 100 && value)}
      />
    </div>
  );
};

export default Sidebar;

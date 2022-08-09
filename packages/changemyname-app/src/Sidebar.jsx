import React, { useState } from "react";
import CheckTreePicker from "rsuite/CheckTreePicker";
import Slider from "rsuite/Slider";
import Button from "rsuite/Button";
import GearIcon from "@rsuite/icons/Gear";
import CloseIcon from "@rsuite/icons/Close";

const Sidebar = ({
  filters,
  zoom,
  searchParams,
  resetFilters,
  onChangeSearchParam,
  selectedFilters,
}) => {
  const [expanded, setExpanded] = useState(
    !!localStorage.getItem("sidebar-expanded")
  );
  const getValue = (name) => {
    const value = searchParams.has(name) && searchParams.get(name);
    return value ? value.split(",") : [];
  };

  const toggleSidebar = (value, e) => {
    e && e.preventDefault();
    if (value) {
      localStorage.setItem("sidebar-expanded", "true");
    } else {
      localStorage.removeItem("sidebar-expanded");
    }
    setExpanded(value);
  };
  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      {!expanded && (
        <Button
          className="expand-sidebar"
          block={true}
          onClick={(_) => toggleSidebar(true)}
        >
          <GearIcon fontSize="1.5em" />
        </Button>
      )}
      {expanded && filters && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <a
            className="collapse-sidebar"
            href="#"
            onClick={(e) => toggleSidebar(false, e)}
          >
            <CloseIcon fontSize="1.25em" />
          </a>
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
        vertical={!expanded}
      />
    </div>
  );
};

export default Sidebar;

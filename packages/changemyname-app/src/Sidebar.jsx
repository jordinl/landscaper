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

  const zoomToValue = (zoom) => {
    console.log({
      zoom,
      value: (zoom - 100) / 5 / Math.floor((zoom + 50) / 100),
    });
    return (zoom - 100) / 5 / Math.floor((zoom + 50) / 100);
  };

  const valueToZoom = (value) => {
    console.log({
      value,
      zoom: value * 5 * Math.floor(1.5 + value / 10) + 100,
    });
    return value * 5 * Math.round(1.5 + value / 10) + 100;
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
        <div className="sidebar-body">
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
            <a onClick={resetFilters} href="#" className="reset-filters">
              Reset Filters
            </a>
          )}
        </div>
      )}
      <Slider
        min={-10}
        max={10}
        step={0.5}
        value={zoomToValue(zoom)}
        tooltip={false}
        onChange={(value) =>
          onChangeSearchParam("zoom", value !== 0 && valueToZoom(value))
        }
        vertical={!expanded}
        className="zoom-slider"
      />
    </div>
  );
};

export default Sidebar;

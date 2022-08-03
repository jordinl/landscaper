import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Landscape } from "changemyname-base";
// TODO: see if we can import this only if necessary
import { Slider, CheckTreePicker } from "rsuite";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";

const getSelectedFilterValues = (filter, options, values, parentSelected = false) => {
  return options.flatMap(({ children, ...option }) => {
    const selected = parentSelected || values.includes(option.value);
    const selectedChildren = children
      ? getSelectedFilterValues(filter, children, values, selected)
      : [];
    const valueOrLabel = filter.filterBy ? option[filter.filterBy] : option.label
    return [...(selected ? [valueOrLabel] : []), ...selectedChildren];
  });
};

function App() {
  const [landscape, setLandscape] = useState();
  const [zoom, setZoom] = useState(100);
  const { categories, header, filters } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

  const selectedFilters = (filters || []).reduce((agg, filter) => {
    const { name, options } = filter;
    const parsedParams =
      searchParams.has(name) && searchParams.get(name).split(",");
    const values =
      parsedParams && getSelectedFilterValues(filter, options, parsedParams);
    return [...agg, ...(values ? [{ name, values }] : [])];
  }, []);

  const filteredCategories =
    categories &&
    categories.map((category) => {
      const subcategories = category.subcategories.map((subcategory) => {
        const items = subcategory.items.map((item) => {
          const hidden = selectedFilters.find((filter) => {
            return !filter.values.includes(item[filter.name]);
          });

          return { ...item, hidden };
        });
        return { ...subcategory, items };
      });

      return { ...category, subcategories };
    });

  const getFilterValue = (name) => {
    const value = searchParams.has(name) && searchParams.get(name);
    return value ? value.split(",") : [];
  };

  const onChangeFilter = (name, values) => {
    const newSearchParams = new URLSearchParams([
      ...Array.from(searchParams.entries()).filter(([key, _]) => key !== name),
      ...(values && values.length > 0 ? [[name, values.join(",")]] : []),
    ]);

    setSearchParams(newSearchParams);
  };

  useEffect(() => {
    fetch(landscapeUrl)
      .then((response) => response.json())
      .then((landscape) => setLandscape(landscape));
  }, []);

  return (
    landscape && (
      <div className="App">
        <div className="landscape">
          <Landscape
            categories={filteredCategories}
            header={header}
            zoom={zoom / 100}
          />
        </div>
        <div className="sidebar">
          {filters && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {filters.map((filter) => (
                <CheckTreePicker
                  data={filter.options}
                  onChange={(values) => onChangeFilter(filter.name, values)}
                  defaultExpandAll={true}
                  placeholder={`Select ${filter.label}`}
                  key={filter.name}
                  preventOverflow={true}
                  value={getFilterValue(filter.name)}
                />
              ))}
            </div>
          )}
          <Slider
            min={100}
            max={400}
            step={10}
            value={zoom}
            tooltip={false}
            onChange={(value) => setZoom(value)}
          />
        </div>
      </div>
    )
  );
}

export default App;

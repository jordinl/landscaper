import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Landscape } from "changemyname-base";
// TODO: see if we can import this only if necessary
import { Slider, CheckTreePicker } from "rsuite";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";

const getSelectedFilterValues = (options, values, parentSelected = false) => {
  return options.flatMap(({ children, id, label }) => {
    const selected = parentSelected || values.includes(id);
    const selectedChildren = children
      ? getSelectedFilterValues(children, values, selected)
      : [];
    return [...(selected ? [label] : []), ...selectedChildren];
  });
};

function App() {
  const [landscape, setLandscape] = useState();
  const [zoom, setZoom] = useState(100);
  const { categories, header, filters } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

  // TODO: hook up filter
  const selectedFilters = (filters || []).reduce(
    (agg, filter) => {
      const { name, options } = filter;
      const parsedParams = searchParams.has(name) && searchParams.get(name).split(",");
      const values =
        parsedParams && getSelectedFilterValues(options, parsedParams);
      return [...agg, ...(values ? [{ name, values }] : []) ];
    },
    []
  );

  const filteredCategories = categories && categories.map(category => {
      const subcategories = category.subcategories.map(subcategory => {
          const items = subcategory.items.map(item => {
              const hidden = selectedFilters.find(filter => {
                  return !filter.values.includes(item[filter.name])
              })

              return { ...item, hidden }
          })
          return { ...subcategory, items }
      })

      return { ...category, subcategories }
  })

  const getFilterValue = (name) => {
    const value = searchParams.has(name) && searchParams.get(name);
    return value ? value.split(",") : [];
  };

  const onChangeFilter = (name, values) => {
    const newSearchParams = Object.entries({
      ...searchParams,
      [name]: values.join(","),
    }).reduce((agg, [key, value]) => {
      return { ...agg, ...(value ? { [key]: value } : {}) };
    }, {});
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
          {filters &&
            filters.map((filter) => (
              <CheckTreePicker
                data={filter.options}
                onChange={(values) => onChangeFilter(filter.name, values)}
                defaultExpandAll={true}
                placeholder="Select Item"
                key={filter.name}
                valueKey="id"
                preventOverflow={true}
                value={getFilterValue(filter.name)}
              />
            ))}

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

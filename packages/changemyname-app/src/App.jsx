import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Landscape } from "changemyname-base";
// TODO: see if we can import this only if necessary
import { Slider, CheckTreePicker } from "rsuite";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";

function App() {
  const [landscape, setLandscape] = useState();
  const [zoom, setZoom] = useState(100);
  const { categories, header, filters } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

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
            categories={categories}
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

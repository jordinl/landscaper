import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Landscape } from "changemyname-base";
// TODO: see if we can import this only if necessary
import { Slider, CheckTreePicker } from "rsuite";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";
import Modal from "./Modal.jsx";

const getSelectedFilterValues = (
  filter,
  options,
  values,
  parentSelected = false
) => {
  return options.flatMap(({ children, ...option }) => {
    const selected = parentSelected || values.includes(option.value);
    const selectedChildren = children
      ? getSelectedFilterValues(filter, children, values, selected)
      : [];
    const valueOrLabel = filter.filterBy
      ? option[filter.filterBy]
      : option.label;
    return [...(selected ? [valueOrLabel] : []), ...selectedChildren];
  });
};

function App() {
  const [landscape, setLandscape] = useState();
  const { categories, header, filters } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

  const itemsMap =
    landscape &&
    landscape.categories
      .flatMap((category) => {
        return category.subcategories.flatMap(
          (subcategory) => subcategory.items
        );
      })
      .reduce((agg, item) => ({ ...agg, [item.id]: item }), {});

  const selectedItem =
    landscape &&
    searchParams.get("selected") &&
    itemsMap[searchParams.get("selected")];

  const zoom = parseInt(searchParams.get("zoom") || 100);

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

  const onChangeSearchParam = (name, value) => {
    const searchParamsArray = [
      ...Array.from(searchParams.entries()).filter(([key, _]) => key !== name),
      ...(value && (!Array.isArray(value) || value.length > 0)
        ? [[name, value]]
        : []),
    ].sort((a, b) => a[0] > b[0]);

    setSearchParams(searchParamsArray);
  };

  const resetFilters = (e) => {
    e.preventDefault();
    const filterNames = filters.map((filter) => filter.name);
    const searchParamsArray = Array.from(searchParams.entries()).filter(
      ([key, _]) => !filterNames.includes(key)
    );
    setSearchParams(searchParamsArray);
  };

  useEffect(() => {
    fetch(landscapeUrl)
      .then((response) => response.json())
      .then((landscape) => setLandscape(landscape));
  }, []);

  return (
    landscape && (
      <div className="App">
        {selectedItem && (
          <Modal
            item={selectedItem}
            onClose={(e) => onChangeSearchParam("selected", null)}
          />
        )}
        <div className="landscape">
          <Landscape
            categories={filteredCategories}
            header={header}
            zoom={zoom / 100}
            LinkComponent={Link}
          />
        </div>
        <div className="sidebar">
          {filters && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filters.map((filter) => (
                <CheckTreePicker
                  data={filter.options}
                  onChange={(values) =>
                    onChangeSearchParam(filter.name, values)
                  }
                  defaultExpandAll={true}
                  placeholder={`Select ${filter.label}`}
                  key={filter.name}
                  preventOverflow={true}
                  value={getFilterValue(filter.name)}
                />
              ))}

              {selectedFilters.length > 0 && (
                <a
                  onClick={resetFilters}
                  href="#"
                  style={{ textAlign: "right" }}
                >
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
            onChange={(value) =>
              onChangeSearchParam("zoom", value > 100 && value)
            }
          />
        </div>
      </div>
    )
  );
}

export default App;

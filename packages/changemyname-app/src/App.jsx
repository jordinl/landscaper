import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Landscape } from "changemyname-react";
import "./App.css";
import landscapeUrl from "project/assets/landscape.json?url";
import Modal from "./Modal.jsx";
import Sidebar from "./Sidebar.jsx";
import HeaderComponent from "./Header.jsx";

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
  const { filters, itemTypes, categories, header, ...rest } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

  const Header = <HeaderComponent header={header} />;

  const itemsMap =
    landscape &&
    landscape.categories
      .flatMap((category) => {
        return category.subcategories.flatMap((subcategory) =>
          subcategory.items.map((item) => {
            return { ...item, category, subcategory };
          })
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
        <div className="landscape-wrapper">
          <Landscape
            {...rest}
            categories={filteredCategories}
            zoom={zoom / 100}
            Header={Header}
            LinkComponent={Link}
          />
        </div>
        <Sidebar
          filters={filters}
          zoom={zoom}
          resetFilters={resetFilters}
          searchParams={searchParams}
          selectedFilters={selectedFilters}
          onChangeSearchParam={onChangeSearchParam}
        />
      </div>
    )
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Landscape } from "changemyname-base";
import "./App.css";
import landscapeUrl from "project/landscape.json?url";
import Modal from "./Modal.jsx";
import Sidebar from "./Sidebar.jsx";

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

const compareItems = (a, b) => {
  if ((a.large && b.large) || (!a.large && !b.large)) {
    return 0;
  } else if (a.large) {
    return -1;
  }
  return 1;
};

function App() {
  const [landscape, setLandscape] = useState();
  const { filters, itemTypes, ...rest } = landscape || {};
  let [searchParams, setSearchParams] = useSearchParams();

  const categories =
    landscape &&
    landscape.categories.map((category) => {
      const subcategories = category.subcategories.map((subcategory) => {
        const items = subcategory.items
          .map((item) => {
            const itemType = item.type && itemTypes && itemTypes[item.type];
            return { ...item, ...itemType };
          })
          .sort(compareItems);
        return { ...subcategory, items };
      });
      return { ...category, subcategories };
    });

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
        <div className="landscape">
          <Landscape
            categories={filteredCategories}
            zoom={zoom / 100}
            LinkComponent={Link}
            {...rest}
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

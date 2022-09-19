import { Link, useSearchParams } from "react-router-dom";
import { Landscape } from "@landscapist/react";
import "./App.less";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
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

const InteractiveLandscape = ({ landscape }) => {
  const { filters, categories, header, footer, ...rest } = landscape;
  let [searchParams, setSearchParams] = useSearchParams();

  const headerContent = header && <Header header={header} />;
  const footerContent = footer && <Footer footer={footer} />;

  const itemsMap = landscape.categories
    .flatMap((category) => {
      return category.subcategories.flatMap((subcategory) =>
        subcategory.items.map((item) => {
          return { ...item, category, subcategory };
        })
      );
    })
    .reduce((agg, item) => ({ ...agg, [item.id]: item }), {});

  const selectedItem =
    searchParams.get("selected") && itemsMap[searchParams.get("selected")];

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

  return (
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
          header={headerContent}
          footer={footerContent}
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
  );
};

export default InteractiveLandscape;

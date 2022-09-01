import loadTheme from "./loadTheme.js";
import { prepareLandscape } from "changemyname-core";

const transformOptions = (options) => {
  return options
    .map((option) => {
      const children = option.children && transformOptions(option.children);
      const childrenHash = children ? { children } : {};
      const value =
        option.value ||
        option.label
          .toLowerCase()
          .replace(/\+/g, "-plus-")
          .replace(/#/g, "-sharp-")
          .replace(/&/g, "-and-")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/-$/, "")
          .replace(/^-/, "");

      return {
        ...option,
        value,
        ...childrenHash,
      };
    })
    .sort((a, b) => (a.value <= b.value ? -1 : 1));
};

const getDefaultOptions = (landscape, filterName) => {
  const values = landscape.categories.flatMap((category) => {
    return category.subcategories.flatMap((subcategory) => {
      return subcategory.items.flatMap((item) => item[filterName]);
    });
  });

  return [...new Set(values)]
    .sort()
    .filter((_) => _)
    .map((label) => ({ label }));
};

const expandFilters = (landscape) => {
  const filters =
    landscape.filters &&
    landscape.filters.map((filter) => {
      const options = transformOptions(
        filter.options || getDefaultOptions(landscape, filter.name)
      );
      return { ...filter, options };
    });
  return filters;
};

const expandLandscape = async (originalLandscape) => {
  const theme = await loadTheme();
  const { landscape } = prepareLandscape(theme, originalLandscape);
  const filters = expandFilters(landscape);
  return { ...landscape, ...(filters && { filters }) };
};

export default expandLandscape;

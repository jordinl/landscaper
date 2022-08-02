const transformOptions = (options) => {
  return options
    .map((option) => {
      const children = option.children && transformOptions(option.children);
      const childrenHash = children ? { children } : {};
      const id = option.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        ...option,
        id,
        key: id,
        ...childrenHash,
      };
    })
    .sort((a, b) => (a.id <= b.id ? -1 : 1));
};

const expandLandscape = (landscape) => {
  const filters =
    landscape.filters &&
    landscape.filters.map((filter) => {
      const options = transformOptions(filter.options);
      return { ...filter, options };
    });
  const filtersHash = filters ? { filters } : {};
  return { ...landscape, ...filtersHash };
};

export default expandLandscape;

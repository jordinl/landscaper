const transformOptions = (options) => {
  return options
    .map((option) => {
      const children = option.children && transformOptions(option.children);
      const childrenHash = children ? { children } : {};
      const value = option.value || option.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      return {
        ...option,
        value,
        ...childrenHash,
      };
    })
    .sort((a, b) => (a.value <= b.value ? -1 : 1));
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

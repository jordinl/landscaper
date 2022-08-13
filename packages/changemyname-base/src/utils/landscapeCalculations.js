export const itemMargin = 3;
export const smallItemWidth = 34;
export const smallItemHeight = 30;
export const largeItemWidth = 2 * smallItemWidth + itemMargin;
export const largeItemHeight = 2 * smallItemHeight + itemMargin;
export const subcategoryMargin = 6;
export const subcategoryTitleHeight = 20;
export const dividerWidth = 2;
export const categoryBorder = 2;
export const categoryTitleHeight = 40;
export const outerPadding = 15;
export const headerHeight = 50;
export const footerHeight = 20;

// Compute if items are large and/or visible.
// Count number of items, large items count for 4 small items.
// Count number of large items.
const computeItems = (subcategories) => {
  return subcategories.map((subcategory) => {
    const itemsCount = subcategory.items.reduce(
      (count, item) => count + (item.large ? 4 : 1),
      0
    );
    const largeItemsCount = subcategory.items.reduce(
      (count, item) => count + (item.large ? 1 : 0),
      0
    );

    return { ...subcategory, itemsCount, largeItemsCount };
  });
};

// Calculate width and height of a given landscape
export const calculateSize = (categories, header) => {
  const innerWidth = Math.max(
    ...categories.map(({ style }) => style.left + style.width)
  );
  const innerHeight = Math.max(
    ...categories.map(({ style }) => style.top + style.height)
  );

  const width = innerWidth;
  const height = innerHeight + (header ? headerHeight + outerPadding : 0);

  return { width, height };
};

const calculateCategorySize = (subcategories, columns) => {
  const width =
    columns * smallItemWidth +
    (columns - 1) * itemMargin +
    (categoryBorder + itemMargin) * 2;
  const height =
    (subcategories.length - 1) * subcategoryMargin +
    subcategories.reduce((sum, subcategory) => {
      // TODO: verify this works well with large items
      const rows = Math.ceil(subcategory.itemsCount / columns);
      // TODO: this won't work for subcategories without title.
      // TODO: Title should have padding
      const subcategoryHeight =
        rows * smallItemHeight +
        (rows - 1) * itemMargin +
        subcategoryTitleHeight;
      return sum + subcategoryHeight;
    }, 0);

  return { width, height };
};

const calculateVerticalRecursive = ({
  categories,
  additionalHeight,
  additionalWidth,
}) => {
  const height = Math.max(...categories.map((category) => category.height));
  const width =
    categories.reduce((sum, { width }) => sum + width, 0) +
    (categories.length - 1) * outerPadding;

  if ((width + additionalWidth) / (height + additionalHeight) >= 16 / 9) {
    return categories;
  }
  const maxHeight = Math.max(...categories.map((category) => category.height));

  const newCategories = categories.map((category) => {
    if (category.height < maxHeight) {
      return category;
    }

    const { subcategories } = category;

    const maxLargeItems = Math.max(
      ...subcategories.map(({ largeItemsCount }) => largeItemsCount)
    );
    const columns =
      category.columns + (category.columns < maxLargeItems * 2 ? 2 : 1);

    const { width, height } = calculateCategorySize(subcategories, columns);

    return { ...category, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: newCategories,
    additionalHeight,
    additionalWidth,
  });
};

export const calculateVerticalCategory = ({ categories, header, footer }) => {
  const additionalHeight =
    (header ? headerHeight + outerPadding : 0) +
    (footer ? footerHeight + outerPadding : 0) +
    +2 * outerPadding;
  const additionalWidth = 2 * outerPadding;
  const categoriesWithCalculations = categories.map((category) => {
    const subcategories = computeItems(category.subcategories);
    const hasLargeItems = subcategories.find(
      (subcategory) => subcategory.largeItemsCount > 0
    );
    const columns = hasLargeItems ? 2 : 1;

    const { width, height } = calculateCategorySize(subcategories, columns);

    return { ...category, subcategories, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: categoriesWithCalculations,
    additionalHeight,
    additionalWidth,
  });
};

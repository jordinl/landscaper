const defaultTheme = {
  layout: {
    gap: 15,
    item: {
      width: 34,
      height: 34,
      gap: 3,
    },
    subcategory: {
      header: {
        fontSize: 14,
      },
    },
    category: {
      borderSize: 2,
      header: {
        height: 40,
      },
    },
    header: {
      height: 50,
    },
    footer: {
      height: 20,
    },
  },
};

const deepMerge = (obj, defaultObj = defaultTheme) => {
  if (!obj) {
    return defaultObj;
  }

  return Object.entries(defaultObj).reduce((agg, [key, value]) => {
    const newValue =
      typeof value === "object"
        ? deepMerge(obj[key], value)
        : obj[key] || value;
    return { ...agg, [key]: newValue };
  }, {});
};

const extractTheme = (theme) => {
  const { layout } = deepMerge(theme);
  const { item, subcategory, category, header, footer } = layout;
  const smallItemWidth = item.width;
  const smallItemHeight = item.height;
  const itemMargin = item.gap;

  return {
    smallItemWidth,
    smallItemHeight,
    itemMargin,
    largeItemWidth: 2 * smallItemWidth + itemMargin,
    largeItemHeight: 2 * smallItemHeight + itemMargin,
    subcategoryMargin: 2 * itemMargin,
    subcategoryTitleHeight: subcategory.header.fontSize,
    categoryBorder: category.borderSize,
    categoryTitleHeight: category.header.height,
    headerHeight: header.height,
    footerHeight: footer.height,
    outerPadding: layout.gap,
  };
};

export const generateCss = (theme, landscape) => {
  const {
    itemMargin,
    smallItemWidth,
    smallItemHeight,
    largeItemHeight,
    largeItemWidth,
    categoryBorder,
    categoryTitleHeight,
    subcategoryMargin,
    subcategoryTitleHeight,
    outerPadding,
    headerHeight,
    footerHeight,
  } = extractTheme(theme);

  const calculatedCategories = calculateVerticalCategory({
    ...landscape,
    theme,
  });

  return `
    .landscape {
      padding: ${outerPadding}px;
      gap: ${outerPadding}px;  
    }
    
    .landscape-categories {
      display: flex;
      gap: ${outerPadding}px; 
    }
    
    ${calculatedCategories
      .map((category, idx) => {
        return `
        .landscape-category-${idx} {
          width: ${category.width}px;
        }
      `;
      })
      .join("\n")}    
    
    .landscape-header {
      height: ${headerHeight}px;
    }
    
    .landscape-footer {
      height: ${footerHeight}px;
    }

    .landscape-category {
      padding: ${categoryBorder}px;
    }
    
    .landscape-category-header {
      height: ${categoryTitleHeight}px;
    }

    .landscape-category-body {
      padding: ${itemMargin}px;
      gap: ${2 * itemMargin}px;
    }

    .landscape-subcategory-body {
      gap: ${itemMargin}px;
      grid-template-columns: repeat(auto-fit, ${smallItemWidth}px);
    }
    
    .landscape-small-item {
      width: ${smallItemWidth}px;
      height: ${smallItemHeight}px;
    }
    
    .landscape-large-item {
      width: ${largeItemWidth}px;
      height: ${largeItemHeight}px;
    }
  `;
};

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

const calculateCategorySize = (subcategories, columns, extractedTheme) => {
  const {
    smallItemWidth,
    itemMargin,
    categoryBorder,
    subcategoryMargin,
    smallItemHeight,
    subcategoryTitleHeight,
  } = extractedTheme;
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
  extractedTheme,
  additionalHeight,
  additionalWidth,
}) => {
  const { outerPadding } = extractedTheme;
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

    const { width, height } = calculateCategorySize(
      subcategories,
      columns,
      extractedTheme
    );

    return { ...category, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: newCategories,
    extractedTheme,
    additionalHeight,
    additionalWidth,
  });
};

export const calculateVerticalCategory = ({
  categories,
  header,
  footer,
  theme,
}) => {
  const extractedTheme = extractTheme(theme);
  const { headerHeight, outerPadding, footerHeight } = extractedTheme;
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

    const { width, height } = calculateCategorySize(
      subcategories,
      columns,
      extractedTheme
    );

    return { ...category, subcategories, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: categoriesWithCalculations,
    extractedTheme,
    additionalHeight,
    additionalWidth,
  });
};

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
      height: 0,
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

const kebabCase = (string) => {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
};

const injectStyles = (obj) => {
  return Object.entries(obj || {})
    .filter(([_, value]) => typeof value !== "object")
    .map(([key, value]) => `${kebabCase(key)}: ${value};`)
    .join("\n");
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
  const style = (theme && theme.style) || {};

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
      color: black;
      font-size: 14px;
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${outerPadding}px;
      gap: ${outerPadding}px;
      ${injectStyles(style.landscape)}
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
      display: flex;
      flex-direction: column;
      padding: ${categoryBorder}px;
      ${injectStyles(style.category)}
    }
    
    .landscape-category-header {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 16px;
      height: ${categoryTitleHeight}px;
      ${injectStyles(style.category && style.category.header)}
    }

    .landscape-category-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: ${itemMargin}px;
      gap: ${2 * itemMargin}px;
      ${injectStyles(style.category && style.category.body)}
    }
    
    .landscape-subcategory-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: ${itemMargin}px;
      font-size: 15px;
      line-height: 105%;
      text-align: center;
      ${injectStyles(style.subcategory && style.subcategory.header)}
    }

    .landscape-subcategory-body {
      display: grid;
      justify-content: center;
      flex-direction: column;
      gap: ${itemMargin}px;
      grid-template-columns: repeat(auto-fit, ${smallItemWidth}px);
    }
    
    .landscape-item {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    
    .landscape-item,
    .landscape-item:hover,
    .landscape-item:active,
    .landscape-item:focus {
      text-decoration: none;
    }
    
    .landscape-item-large {
      grid-column-end: span 2;
      grid-row-end: span 2;
    }
    
    .landscape-item-hidden {
      visibility: hidden;
    }
    
    .landscape-item-body {
      width: ${smallItemWidth}px;
      height: ${smallItemHeight}px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      ${injectStyles(style.Item)}
    }
    
    .landscape-item-large .landscape-item-body {
      width: ${largeItemWidth}px;
      height: ${largeItemHeight}px;
    }
    
    .landscape-item-label {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    
    .landscape-item-body img {
      min-width: 0;
      min-height: 0;
      flex: 1;
    }
    
    ${Object.entries((style.Item || {}).variants || {})
      .map(([name, values]) => {
        return `.landscape-item-variant-${name} .landscape-item-body {
          ${injectStyles(values)}
        }
        
        .landscape-item-variant-${name} .landscape-item-label {
          ${injectStyles(values.Label)}
        }
        
        .landscape-item-variant-${name} .landscape-item-body img {
          ${injectStyles(values.Image)}
        }`;
      })
      .join("\n")} 
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

export const calculateVerticalCategory = ({ categories, footer, theme }) => {
  const extractedTheme = extractTheme(theme);
  const { headerHeight, outerPadding, footerHeight } = extractedTheme;
  const additionalHeight =
    (headerHeight > 0 ? headerHeight + outerPadding : 0) +
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

const defaultTheme = {
  Layout: {
    gap: 15,
    Item: {
      width: 34,
      height: 34,
      gap: 3,
    },
    Subcategory: {
      Header: {
        fontSize: 14,
      },
    },
    Category: {
      borderSize: 2,
      Header: {
        height: 40,
      },
    },
    Header: {
      height: 0,
    },
    Footer: {
      height: 20,
    },
  },
};

const deepMerge = (left, right) => {
  if (!left) {
    return right || {};
  }
  if (!right) {
    return left || {};
  }

  const keys = Object.keys({ ...left, ...right });

  return keys.reduce((agg, key) => {
    const rightValue = right && right[key];
    const leftValue = left[key] && left[key];
    const newValue =
      typeof leftValue === "object" || typeof rightValue === "object"
        ? deepMerge(leftValue, rightValue)
        : leftValue || rightValue;
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
  const { Layout } = deepMerge(theme, defaultTheme);
  const { Item, Subcategory, Category, Header, Footer } = Layout;
  const smallItemWidth = Item.width;
  const smallItemHeight = Item.height;
  const itemMargin = Item.gap;

  return {
    smallItemWidth,
    smallItemHeight,
    itemMargin,
    largeItemWidth: 2 * smallItemWidth + itemMargin,
    largeItemHeight: 2 * smallItemHeight + itemMargin,
    subcategoryMargin: 2 * itemMargin,
    subcategoryTitleHeight: Subcategory.Header.fontSize,
    categoryBorder: Category.borderSize,
    categoryTitleHeight: Category.Header.height,
    headerHeight: Header.height,
    footerHeight: Footer.height,
    outerPadding: Layout.gap,
  };
};

const unpackVariants = (hash) => {
  return Object.entries(hash).reduce((agg, [key, value]) => {
    if (key === "Variants") {
      const Variants = Object.entries(value).reduce(
        (agg, [key, { extend, ...rest }]) => {
          const otherVariant = (extend && value[extend]) || {};
          return { ...agg, [key]: deepMerge(rest, otherVariant) };
        },
        {}
      );
      return { ...agg, Variants };
    } else {
      const newValue =
        typeof value === "object" ? unpackVariants(value) : value;
      return { ...agg, [key]: newValue };
    }
  }, {});
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
  const largeItemStyle = {
    Item: {
      Variants: {
        Large: {
          width: `${largeItemWidth}px`,
          height: `${largeItemHeight}px`,
          Wrapper: {
            gridColumnEnd: "span 2",
            gridRowEnd: "span 2",
          },
        },
      },
    },
  };
  const style = unpackVariants(deepMerge(largeItemStyle, theme && theme.Style));

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
      ${injectStyles(style.Landscape)}
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
      ${injectStyles(style.Category)}
    }
    
    .landscape-category-header {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      font-size: 16px;
      height: ${categoryTitleHeight}px;
      ${injectStyles(style.Category && style.Category.Header)}
    }

    .landscape-category-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: ${itemMargin}px;
      gap: ${2 * itemMargin}px;
      ${injectStyles(style.Category && style.Category.Body)}
    }
    
    .landscape-subcategory-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: ${itemMargin}px;
      font-size: 15px;
      line-height: 105%;
      text-align: center;
      ${injectStyles(style.Subcategory && style.Subcategory.Header)}
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
      ${injectStyles(style.Item && style.Item.Image)}
    }
    
    ${Object.entries((style.Item || {}).Variants || {})
      .map(([name, values]) => {
        return `.landscape-item-variant-${name} {
          ${injectStyles(values.Wrapper)}
        }

        .landscape-item-variant-${name} .landscape-item-body {
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

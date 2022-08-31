import calculateContrast from "./calculateContrast.js";

const defaultTheme = {
  Layout: {
    gap: 15,
    Item: {
      width: 100,
      height: 100,
      gap: 10,
      Variants: {},
    },
    Subcategory: {
      Header: {
        fontSize: 14,
      },
    },
    Category: {
      Header: {
        height: 40,
      },
    },
    Divider: {},
    Header: {},
    Footer: {},
  },
  Style: {
    Landscape: {},
    Category: {
      Body: {},
      Header: {},
    },
    Divider: {},
    Subcategory: {},
    Item: {
      Image: {},
      Variants: {},
    },
  },
};

const deepMerge = (left, right, ...rest) => {
  if (!left) {
    return right || {};
  }
  if (!right) {
    return left || {};
  }

  if (rest.length > 0) {
    return deepMerge(deepMerge(left, right), ...rest);
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

const extractTheme = (theme, options = {}) => {
  const { includeHeader, includeFooter } = options;
  const baseTheme = deepMerge(theme, defaultTheme);
  const { Layout } = baseTheme;
  const { Item, Divider, Category } = Layout;
  let dividerWidth = 0;

  if (Divider.width === undefined && Category.borderWidth === undefined) {
    dividerWidth = 2;
  }

  const extraDefaults = {
    Layout: {
      Divider: {
        width: dividerWidth,
      },
      Category: {
        borderWidth: 0,
      },
      Header: {
        ...(includeHeader && { height: 50 }),
      },
      Footer: {
        ...(includeFooter && { height: 20 }),
      },
    },
  };

  const largeItemStyle = {
    Layout: {
      Item: {
        Variants: {
          Large: {
            width: 2 * Item.width + Item.gap,
            height: 2 * Item.width + Item.gap,
            Wrapper: {
              gridColumnEnd: "span 2",
              gridRowEnd: "span 2",
            },
          },
        },
      },
    },
  };

  return unpackVariants(deepMerge(largeItemStyle, baseTheme, extraDefaults));
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

const injectSize = (size) => {
  return Object.entries(size || {})
    .filter(([key, _]) => ["width", "height"].includes(key))
    .map(([key, value]) => `${key}: ${value}px;`)
    .join("\n");
};

const sortBySize = (theme, landscape) => {
  const { Layout } = extractTheme(theme);
  const variants = Layout.Item.Variants;
  const compareFn = (left, right) => {
    const leftVariant = (left.variant && variants[left.variant]) || Layout.Item;
    const rightVariant =
      (right.variant && variants[right.variant]) || Layout.Item;
    return rightVariant.height - leftVariant.height;
  };

  const categories = landscape.categories.map((category) => {
    const subcategories = category.subcategories.map((subcategory) => {
      const items = subcategory.items.sort(compareFn);
      return { ...subcategory, items };
    });
    return { ...category, subcategories };
  });

  return { ...landscape, categories };
};

const addDefaultSubcategory = (landscape) => {
  const categories = landscape.categories.map((category) => {
    const subcategories = category.subcategories || [{ items: category.items }];

    return { ...category, subcategories };
  });

  return { ...landscape, categories };
};

export const prepareLandscape = (theme, landscape) => {
  return sortBySize(theme, addDefaultSubcategory(landscape));
};

const getFontColor = (backgroundColor) => {
  return calculateContrast(backgroundColor, "black") > 5 ? "black" : "white";
};

export const generateCss = (theme, landscape) => {
  const extractedTheme = extractTheme(theme, {
    includeHeader: landscape.header,
    includeFooter: landscape.footer,
  });
  const style = extractedTheme.Style;
  const layout = extractedTheme.Layout;
  const { categories } = addDefaultSubcategory(landscape);

  const calculatedCategories = calculateVerticalCategory({
    categories,
    layout,
  });

  const backgroundColor = style.Landscape.backgroundColor || "white";
  const fontColor = getFontColor(backgroundColor);

  const categoryColor = style.Category.backgroundColor || backgroundColor;
  const categoryFontColor = getFontColor(categoryColor);

  const categoryHeaderColor =
    style.Category.Header.backgroundColor || categoryColor;
  const categoryHeaderFontColor = getFontColor(categoryHeaderColor);

  const subcategoryColor =
    style.Subcategory.backgroundColor ||
    style.Category.Body.backgroundColor ||
    categoryColor;
  const subcategoryFontColor = getFontColor(subcategoryColor);

  return `
    .landscape {
      color: ${fontColor};
      font-size: 14px;
      line-height: 1.2;
      transform-origin: 0 0;
      box-sizing: border-box;
      display: flex;
      flex-shrink: 0;
      flex-direction: column;
      padding: ${layout.gap}px;
      gap: ${layout.gap}px;
      ${injectStyles(style.Landscape)}
    }
    
    .landscape-categories {
      display: flex;
      justify-content: center;
      gap: ${layout.gap}px; 
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
      height: ${layout.Header.height}px;
    }
    
    .landscape-footer {
      height: ${layout.Footer.height}px;
    }

    .landscape-category {
      color: ${categoryFontColor};
      display: flex;
      flex-direction: column;
      ${
        layout.Category.borderWidth
          ? `border: ${layout.Category.borderWidth}px solid ${
              style.Category.borderColor || fontColor
            }`
          : ""
      };
      ${injectStyles(style.Category)}
    }
    
    .landscape-category-header {
      color: ${categoryHeaderFontColor};
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: 100%;
      font-size: 16px;
      min-height: ${layout.Category.Header.height}px;
      ${injectStyles(style.Category.Header)}
    }

    .landscape-category-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: ${layout.Item.gap}px;
      gap: ${2 * layout.Item.gap}px;
      ${injectStyles(style.Category.Body)}
    }
    
    .landscape-category-divider {
      background-color: ${fontColor};
      ${layout.Divider.width === 0 ? "display: none;" : ""};
      ${injectStyles(style.Divider)};
      ${injectSize(layout.Divider)};
    }
    
    .landscape-subcategory {
      color: ${subcategoryFontColor};
    }
    
    .landscape-subcategory-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: ${layout.Item.gap}px;
      font-size: 15px;
      text-align: center;
      ${injectStyles(style.Subcategory.Header)}
    }

    .landscape-subcategory-body {
      display: grid;
      justify-content: center;
      flex-direction: column;
      gap: ${layout.Item.gap}px;
      grid-template-columns: repeat(auto-fit, ${layout.Item.width}px);
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
      cursor: pointer;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      ${injectStyles(style.Item)}
    }
    
    .landscape-item .landscape-item-body {
      ${injectSize(layout.Item)}
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
      ${injectStyles(style.Item.Image)}
    }
    
    ${Object.entries(style.Item.Variants)
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
      
      ${Object.entries(layout.Item.Variants)
        .map(([name, values]) => {
          return `.landscape-item.landscape-item-variant-${name} {
              ${injectStyles(values.Wrapper)}
            }
            
            .landscape-item.landscape-item-variant-${name} .landscape-item-body {
              ${injectSize(values)};
            }
        `;
        })
        .join("\n")} 
  `;
};

// Compute if items are large and/or visible.
// Count number of items, large items count for 4 small items.
// Count number of large items.
const computeItems = (subcategories, layout) => {
  const variants = layout.Item.Variants || {};
  return subcategories.map((subcategory) => {
    const largeItemsCount = subcategory.items.reduce((count, item) => {
      const variant = (item.variant && variants[item.variant]) || layout.Item;
      return count + (variant.height > layout.Item.height ? 1 : 0);
    }, 0);

    const itemsCount = subcategory.items.length + largeItemsCount * 3;
    return { ...subcategory, itemsCount, largeItemsCount };
  });
};

const calculateCategorySize = (subcategories, columns, layout) => {
  const width =
    columns * layout.Item.width +
    (columns - 1) * layout.Item.gap +
    (layout.Category.borderWidth + layout.Item.gap) * 2;
  const height =
    (subcategories.length - 1) * 2 * layout.Item.gap +
    subcategories.reduce((sum, subcategory) => {
      // TODO: verify this works well with large items
      const rows = Math.ceil(subcategory.itemsCount / columns);
      // TODO: this won't work for subcategories without title.
      // TODO: Title should have padding
      const subcategoryHeight =
        rows * layout.Item.height +
        (rows - 1) * layout.Item.gap +
        (subcategory.name ? layout.Subcategory.Header.fontSize : 0);
      return sum + subcategoryHeight;
    }, 0);

  return { width, height };
};

const calculateVerticalRecursive = ({
  categories,
  layout,
  additionalHeight,
  additionalWidth,
}) => {
  const height = Math.max(...categories.map((category) => category.height));
  const width =
    categories.reduce((sum, { width }) => sum + width, 0) +
    (categories.length - 1) * layout.gap;

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
      layout
    );

    return { ...category, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: newCategories,
    layout,
    additionalHeight,
    additionalWidth,
  });
};

const calculateVerticalCategory = ({ categories, layout }) => {
  const { Header, Footer, gap } = layout;
  const additionalHeight =
    (Header.height > 0 ? Header.height + gap : 0) +
    (Footer.height ? Footer.height + gap : 0) +
    +2 * gap;
  const additionalWidth = 2 * gap;

  const categoriesWithCalculations = categories.map((category) => {
    const subcategoriesOrItems = category.subcategories || [
      { items: category.items },
    ];
    const subcategories = computeItems(subcategoriesOrItems, layout);
    const hasLargeItems = subcategories.find(
      (subcategory) => subcategory.largeItemsCount > 0
    );
    const columns = hasLargeItems ? 2 : 1;

    const { width, height } = calculateCategorySize(
      subcategories,
      columns,
      layout
    );

    return { ...category, subcategories, width, height, columns };
  });

  return calculateVerticalRecursive({
    categories: categoriesWithCalculations,
    layout,
    additionalHeight,
    additionalWidth,
  });
};

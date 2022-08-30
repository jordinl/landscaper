import React from "react";
import { withRouter } from "storybook-addon-react-router-v6";
import LandscapeComponent from "changemyname-app/src/InteractiveLandscape";
import { generateCss } from "changemyname-core";

const createItem = (number, logo) => {
  return {
    id: `item-${number}`,
    name: `item-${name}`,
    logo: logo,
  };
};

const landscape = {
  header: [
    {
      type: "html",
      content: "<h1>Demo Landscape</h1>",
    },
  ],
  footer: [
    {
      content: "Footer goes here",
    },
  ],
  categories: [
    {
      name: "Category 1",
      subcategories: [
        {
          name: "Subcategory 1",
          items: [
            createItem(1, "assets/colors.svg"),
            createItem(2, "assets/colors.svg"),
            createItem(3, "assets/colors.svg"),
            createItem(4, "assets/colors.svg"),
          ],
        },
      ],
    },
    {
      name: "Category 2",
      subcategories: [
        {
          name: "Subcategory 2",
          items: [
            createItem(5, "assets/direction.svg"),
            createItem(6, "assets/direction.svg"),
            createItem(7, "assets/direction.svg"),
            createItem(8, "assets/direction.svg"),
          ],
        },
      ],
    },
    {
      name: "Category 3",
      subcategories: [
        {
          name: "Subcategory 3",
          items: [
            createItem(9, "assets/flow.svg"),
            createItem(10, "assets/flow.svg"),
            createItem(11, "assets/flow.svg"),
            createItem(12, "assets/flow.svg"),
          ],
        },
      ],
    },
    {
      name: "Category 4",
      subcategories: [
        {
          name: "Subcategory 4",
          items: [
            createItem(13, "assets/stackalt.svg"),
            createItem(14, "assets/stackalt.svg"),
            createItem(15, "assets/stackalt.svg"),
            createItem(16, "assets/stackalt.svg"),
          ],
        },
      ],
    },
  ],
};

const theme = {
  Layout: {
    Header: {
      height: 40,
    },
    Footer: {
      height: 20,
    },
    Divider: {
      width: 2,
    },
    Item: {
      width: 100,
      height: 100,
      gap: 10,
    },
  },
};

const packObj = (obj, path = null) => {
  return Object.entries(obj).reduce((agg, [k, v]) => {
    const newPath = path ? `${path}.${k}` : k;
    const values =
      typeof v === "object" ? packObj(v, newPath) : { [newPath]: v };
    return { ...agg, ...values };
  }, {});
};

const unpackObj = (obj) => {
  let result = {};
  Object.entries(obj).forEach(([k, v]) => {
    let current = result;
    const keys = k.split(".");
    keys.forEach((key, idx) => {
      current[key] = idx === keys.length - 1 ? v : current[key] || {};
      current = current[key];
    });
  });
  return result;
};

export default {
  title: "Example/InteractiveLandscape",
  component: LandscapeComponent,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
  args: packObj({ theme }),
};

export const InteractiveLandscape = (args) => {
  const { theme } = unpackObj(args);
  const css = generateCss(theme, landscape);
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <LandscapeComponent landscape={landscape} />;
    </React.Fragment>
  );
};

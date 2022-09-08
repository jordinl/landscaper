import React from "react";
import { withRouter } from "storybook-addon-react-router-v6";
import LandscapeComponent from "@landscaper/interactive/src/InteractiveLandscape";
import { prepareLandscape } from "@landscaper/core";
import { BrowserRouter } from "react-router-dom";

const createItem = (number, logo) => {
  return {
    id: `item-${number}`,
    name: `Item ${number}`,
    logo: logo,
  };
};

const originalLandscape = {
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
      items: [
        createItem(1, "assets/colors.svg"),
        createItem(2, "assets/colors.svg"),
        createItem(3, "assets/colors.svg"),
        createItem(4, "assets/colors.svg"),
      ],
    },
    {
      name: "Category 2",
      items: [
        createItem(5, "assets/direction.svg"),
        createItem(6, "assets/direction.svg"),
        createItem(7, "assets/direction.svg"),
        createItem(8, "assets/direction.svg"),
      ],
    },
    {
      name: "Category 3",
      items: [
        createItem(9, "assets/flow.svg"),
        createItem(10, "assets/flow.svg"),
        createItem(11, "assets/flow.svg"),
        createItem(12, "assets/flow.svg"),
      ],
    },
    {
      name: "Category 4",
      items: [
        createItem(13, "assets/stackalt.svg"),
        createItem(14, "assets/stackalt.svg"),
        createItem(15, "assets/stackalt.svg"),
        createItem(16, "assets/stackalt.svg"),
      ],
    },
  ],
};

const theme = {};

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
  const { css, landscape } = prepareLandscape(theme, originalLandscape);
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <BrowserRouter>
        <LandscapeComponent landscape={landscape} />;
      </BrowserRouter>
    </React.Fragment>
  );
};

import React from "react";
import { withRouter } from "storybook-addon-react-router-v6";
import LandscapeComponent from "changemyname-app/src/InteractiveLandscape";
import { generateCss } from "changemyname-react/src";

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
            {
              id: "item-1",
              name: "Item 1",
              logo: "assets/colors.svg",
            },
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
            {
              id: "item-2",
              name: "Item 2",
              logo: "assets/direction.svg",
            },
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
            {
              id: "item-3",
              name: "Item 3",
              logo: "assets/flow.svg",
            },
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
            {
              id: "item-4",
              name: "Item 4",
              logo: "assets/stackalt.svg",
            },
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
    Category: {
      borderWidth: 2,
    },
    Item: {
      width: 100,
      height: 100,
      gap: 10,
    },
  },
  Style: {
    Landscape: {
      background: "#003366",
      color: "white",
    },
    Category: {
      backgroundColor: "#660066",
      Body: {
        backgroundColor: "white",
      },
    },
  },
};

export default {
  title: "Example/InteractiveLandscape",
  component: LandscapeComponent,
  decorators: [withRouter],
  parameters: {
    layout: "fullscreen",
  },
  // argTypes: {
  //   theme: {
  //     control: {
  //       type: "json",
  //     },
  //   },
  // },
  args: { theme },
};

export const InteractiveLandscape = (args) => {
  const css = generateCss(args.theme, landscape);
  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <LandscapeComponent landscape={landscape} />;
    </React.Fragment>
  );
};

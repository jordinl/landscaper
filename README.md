# Landscapist

Easily create a Landscape from a collection of images. Inspired by [cncf/landscapeapp](https://github.com/cncf/landscapeapp)
with simplicity and extensibility in mind.

Landscapist does not care where the data to create a landscape comes from (whether that's Crunchbase, GitHub or something else).
Instead each landscape creator should either write the data manually in `landscape.json` or write scripts that pull such
information from 3rd party sources.

## Requirements

Node.js 14 <= version < 17 and a package manager (npm, yarn or pnpm)

## Installation

Depending on the package manager used, execute one of the following commands and follow the instructions:
npm: `npx -y create-landscape@latest <directory>`
yarn: `yarn create landscape <directory>`
pnpm: `pnpm create landscape <directory>`

**NOTE: When executing one of the commands above in a directory containing a landscape created with [cncf/landscapeapp](https://github.com/cncf/landscapeapp)
the script will offer the option to convert such landscape into the appropriate format.**

## Running a landscape locally

- npm: `npm run dev`
- yarn: `yarn dev`
- pnpm: `pnpm dev`

## Building a landscape

- npm: `npm run build`
- yarn: `yarn build`
- pnpm: `pnpm build`

This command will generate and export a build inside the `dist/` folder

## Previewing a build landscape

- npm: `npm run preview`
- yarn: `yarn preview`
- pnpm: `pnpm preview`

This command will show a landscape that has been build inside the `dist/` folder.

## Deploying a landscape

First run `npm|yarn|pnm run build` and then just deploy the `dist/` created. Platforms such as Vercel or Netlify should
allow to do that easily, probably it would also be possible to deploy a site using github pages. For instance, I've
deployed the Landscapist version of the CNCF Landscape to Vercel: [landscapist-cncf.vercel.app](https://landscapist-cncf.vercel.app/)

## landscape.json structure

The landscape contents should be saved in `landscape.json` placed at the top of the landscape directory. Any logos/images
should be saved in the `assets/` directory.

### Simple landscape

The main goal of a landscape is to show a collection of images grouped into categories/subcategories. As such the
simplest landscape would be:

```json
{
  "categories": [
    {
      "name": "Category 1",
      "items": [
        {
          "id": "item-1",
          "name": "Item 1",
          "logo": "logos/logo1.svg"
        }
      ]
    }
  ]
}
```

Notice that the item logo is `logos/logo1.svg`, that's relative to the `assets/` directory, so there should be a logo with
path `assets/logo/logo1.svg`

### Categories with subcategories

Categories can have subcategories with items.

```json
{
  "categories": [
    {
      "name": "Category 1",
      "subcategories": [
        {
          "name": "Subcategory 1",
          "items": [
            {
              "id": "item-1",
              "name": "Item 1",
              "logo": "logos/logo1.svg"
            }
          ]
        }
      ]
    }
  ]
}
```

### Adding header

Add a "header" object to `landscape.json`. The children of this object can be "left", "center" or "right" object depending
on how they should be aligned. It's not mandatory to use these three values, any combination of these or none at all are valid.

```json
{
  "header": {
    "left": {
      "content": "Left aligned content"
    },
    "center": {
      "content": "Centered content"
    },
    "right": {
      "content": "Right aligned content"
    }
  }
}
```

Header content can be plain text, like in the examples above. HTML like:

```json
{
  "header": {
    "left": {
      "content": "<h1>Left aligned content</h1>",
      "type": "html"
    }
  }
}
```

Or an image (which should exist in the `assets/` directory (eg `assets/logo.svg`):

```json
{
  "header": {
    "left": {
      "src": "logo.svg",
      "type": "image"
    }
  }
}
```

### Adding a footer

A footer works exacly the same as the header, but with a "footer" object instead.

### Adding filters

Items on a landscape can be filtered by any of their values. Filters can be configured by adding a "filters" key to
`landscape.json`

```json
{
  "categories": [
    {
      "name": "Category 1",
      "items": [
        {
          "id": "item-1",
          "name": "Item 1",
          "logo": "logos/logo1.svg",
          "language": "Ruby"
        },
        {
          "id": "item-2",
          "name": "Item 2",
          "logo": "logos/logo2.svg",
          "language": "Python"
        }
      ]
    }
  ],
  "filters": [
    {
      "name": "language",
      "label": "Language"
    }
  ]
}
```

This will add a Language filter with values "Python" and "Ruby" and when one value is selected it will filter those items
whose `language` matches the selected value.

### Showing information in the item modal

The item description will be shown in the modal

```json
{
  "categories": [
    {
      "name": "Category 1",
      "items": [
        {
          "id": "item-1",
          "name": "Item 1",
          "logo": "logos/logo1.svg",
          "description": "A very interesting description"
        }
      ]
    }
  ]
}
```

It's also possible to show a list of key value pairs in "item.details":

```json
{
  "categories": [
    {
      "name": "Category 1",
      "items": [
        {
          "id": "item-1",
          "name": "Item 1",
          "logo": "logos/logo1.svg",
          "details": [
            {
              "label": "Country",
              "text": "United States"
            }
          ]
        }
      ]
    }
  ]
}
```

Details item could also be a URL, like:

```json
{
  "label": "Homepage",
  "url": "https://github.com"
}
```

Or a link:

```json
{
  "label": "Twitter",
  "url": "https://twitter.com/hello",
  "text": "@hello"
}
```

## More advanced usages

TODO.

For the time being, the easiest would be to clone this repo. Run `pnpm install` and `pnpm prepare:cncf-landscape`.

This will generate the `landscape.json` file for the CNCF landscape under `apps/cncf-landscape/landscape.json` and the theme
in `apps/cncf-landscape/theme.json`.

Additionally, you'll be able to run the CNCF landscape by executing `pnpm dev:cncf-landscape`.

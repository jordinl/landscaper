# Landscapist

Easily create a Landscape from a collection of images.

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

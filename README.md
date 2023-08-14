# vennt-frontend

Website: https://vennt.vercel.app

This repo is for the frontend of the VENNT character sheet site. The backend repo is [here](https://github.com/JackNolanDev/vennt-server-v2).
This is using the VUE 3 framework with typescript.

## Project setup

Required software:
1. [pnpm](https://pnpm.io/installation) - package manager.

Install dependencies
```sh
pnpm install
```

### Steps to run locally without server

Copy the `.env.example` file to `.env`. This sets the environment variable for which API_URL to use by default. In order to use a local backend, either remove this or set the variable to the backend url: `http://localhost:5001`

## Local Development

```sh
pnpm run dev
```

---

## Important notes

All type definitions that need to exist in the frontend & backend (like APIs) are being defined using [zod](https://github.com/colinhacks/zod) in the [backendTypes.ts file](https://github.com/JackNolanDev/vennt-frontend-v2/blob/main/src/utils/backendTypes.ts). This file needs to remain consistent with whatever is being used by the server, [here](https://github.com/JackNolanDev/vennt-server-v2/blob/main/src/utils/types.ts). If you change a value in the types file, please make sure it's consistent everywhere! Ideally at some point this could move to a monorepo or something to make this consistency easier.

### Quick Tour

All code lives in the `/src` folder.

- `/src/views` - Contains the parent Vue code for each page defined by the router.
- `/src/components` - Contains all of the Vue components that are used by the site. They are generally organized by the types of data they interact with.
- `/src/router` - Defines all of the routes the site currently supports
- `/src/stores` - Defines all of the cross-component storage for our Vue components. Also generally handles API fetching and organizing any complex data.
- `/src/api` - This has code for making network requests
- `/src/utils` - This is where all complex logic on the site exists.
- `/src/utils/copy` - This is where most copy / code based configuration for the site exists

---
## Default README

This template should help get you started developing with Vue 3 in Vite.

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

#### Compile and Hot-Reload for Development

```sh
npm run dev
```

#### Type-Check, Compile and Minify for Production

```sh
npm run build
```

#### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


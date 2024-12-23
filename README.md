# vue-template

This template should help get you started developing with Vue 3 in Vite. Setup:

npm install
npm run format
npm run dev

## Github setup

Settings > Actions > General > Workflow permissions 
Read and write permissions.

## Adding Auth0

Start with adding the Auth0 package

`npm install @auth0/auth0-vue`

Add the enrionment files

`.env.development`
`.env.production`

In the main.ts file add the following:

```js
import { createAuth0 } from '@auth0/auth0-vue'

app.use(
  createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
      redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
    },
  }),
)
```

Using authGuard for routes

```js
import { authGuard } from '@auth0/auth0-vue'

{
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    beforeEnter: authGuard,
}
```

## Adding vuetify

https://yaasir007.medium.com/how-to-add-vuetify-3-to-an-existing-vue-3-project-13cd0409e78b

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

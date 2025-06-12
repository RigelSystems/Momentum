# Vue Frontend Rules for Momentum

- Use the Composition API.
- Use `NovaUI` components when available, `NovaUI` is my library and imports all components, if you think we need to implement another component, mention it.
- Pages live in `src/pages`, components in `src/components`, and composables in `src/composables`.
- Use Vite for builds; keep configs minimal and modular.
- Use `import { useAuthToken } from '@/composables/useAuthToken'` when making requests to the API.
- We also need to start implementing vitests for all js files
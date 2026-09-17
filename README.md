# Richfield Connect

Richfield Connect is a responsive React SPA for Richfield students to build academic profiles, share ideas and participate in a focused campus community.

## Run locally

```bash
npm install
npm run dev
```

For a production check:

```bash
npm run lint
npm run build
```

## Features

- React Router client-side navigation across Home, About, Sign Up, Login, Profile and Feed views
- Controlled registration form with inline validation and live profile preview
- Context API plus `useReducer` for user session and post state
- localStorage persistence for profiles, session state, posts, likes and comments
- Create, edit, delete, like and comment interactions for posts
- Responsive Richfield blue visual system for mobile, tablet and desktop

## Component architecture

- `src/AppContext.jsx` owns global state, reducer actions and localStorage hydration
- `src/components.jsx` keeps the reusable navigation, footer, preview, composer and post components together
- `src/views/` contains the route-level page components
- `src/App.jsx` defines the BrowserRouter routes and shared application shell

## External resources

- React documentation: https://react.dev/
- React Router documentation: https://reactrouter.com/
- Vite documentation: https://vite.dev/
- Google Fonts: DM Sans and Playfair Display

Student details and student number can be added here before submission.

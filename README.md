# Web Calendar

Web Calendar is a full-featured calendar web application built with React and TypeScript, using Vite for fast development. It allows users to manage events across multiple calendars with a rich set of features like recurring events, color-coded calendars, and a live time indicator. The project follows the Feature-Sliced Design (FSD) architectural methodology for a scalable code structure and uses Redux Toolkit for state management. An internal UI Kit provides reusable components and supports a dark/light theme switcher for an optimal user experience. Firebase is integrated for user authentication and data storage, and the app includes unit tests to ensure reliability.

## Features

- Integrated UI Kit: The application includes a custom-built UI component library (buttons, inputs, modals, etc.) used throughout the app for a consistent look and feel. This internal UI Kit is tailored to the app’s needs and supports theming, ensuring that the dark/light mode is applied uniformly.
- State Management with Redux Toolkit: The app leverages Redux Toolkit for efficient state management. This simplifies state updates (using slices and reducers) and uses the Redux ecosystem (actions, store) under the hood, providing a predictable state container for the app’s data (calendars, events, user info, theme, etc.).
- Feature-Sliced Design Architecture: The codebase is organized according to Feature-Sliced Design principles. This means the project is divided into clear layers (such as application-level, features, entities, shared components, pages, etc.), making the code scalable and maintainable. Each feature or module of the app resides in its own “slice” of the project, promoting separation of concerns and reusability.
- Event Management (Create/View/Edit/Delete Events): Users can fully manage calendar events. They can create new events by selecting a date and time or by clicking directly on a calendar cell for quick addition, view all events displayed on the calendar interface, edit event details (such as title, time, or recurrence), and delete events that are no longer needed. When an event is added or modified, it’s immediately reflected in the UI and saved to the backend .
- Multiple Calendars (Create/Edit/Delete Calendars): The app supports multiple calendars so that users can organize events into categories (for example, "Work", "Personal", etc.). Users can create new calendars, give each a name and color, edit calendar details (rename or change color), and delete calendars when they are no longer needed. Each calendar’s events are handled separately, allowing better organization of schedules.
- Color-Coded Events per Calendar: Events are tied to the calendar they belong to, and each calendar is assigned a distinct color. The events on the calendar UI are color-coded to match their calendar. This way, users can easily distinguish which calendar an event comes from at a glance.
- Default Calendar: The application provides a default calendar (initially present on first use) which cannot be deleted to ensure there is always at least one calendar available.
- Calendar Visibility Toggle: In the calendar list, each calendar has a checkbox or toggle to show/hide its events. Users can uncheck a calendar to temporarily hide all events belonging to that calendar from the main view.
- Date Picker for Navigation: A date picker control allows users to jump to any specific date quickly. Selecting a date via the date picker will update the current view to that day (in Day view) or week (in Week view), and the events displayed will correspond to the chosen date.
- Day and Week Views: Users can switch between a day view (seeing one day’s schedule hourly) and a week view (seeing an entire week’s events).
- Recurring Events (Repeat Functionality): The calendar supports creating recurring events. When adding or editing an event, users can set it to repeat on a schedule (for example, daily, weekly on a certain day, monthly, etc.). The app will handle displaying these repeat events on the appropriate dates.
- Current Time Indicator: In day/week views, the current time is indicated by a red horizontal line that runs across the timeline. It updates itself every minute, moving downwards as time progresses.
- Quick Event Creation: Users can create events quickly by clicking on an empty time slot in the calendar grid.
- Dark/Light Theme Switcher: The interface supports both light mode and dark mode. A theme switch lets the user swap the UI theme on the fly.
- Firebase Integration (Auth & Database): The app uses Firebase as its backend service. Firebase Authentication handles user sign-up/sign-in (for example, using email/password login on the provided login page), ensuring that each user’s data is secure and private. Firebase Firestore is used to store calendar and event data in the cloud. All create/edit/delete operations on calendars and events are sent to Firebase so that data is persisted and can be synchronized across devices. This means a user can log in from another browser or device and see the same calendars and events, as the data is centrally stored.
- Login Page & Protected Routes: A dedicated login page is included, which is the entry point for the application if the user is not yet authenticated. Users must log in to access the main Calendar app.
- Unit Tests: A suite of unit tests has been implemented to maintain code quality.
- Deployed to Firebase Hosting: The project has been successfully deployed to Firebase Hosting. All necessary Firebase configuration files, including hosting setup and deployment scripts, are included. The application is live and accessible via the provided Firebase URL or a configured custom domain. Users can interact with the fully functional Web Calendar directly from the web.

# Technologies Used

This project is built with a modern web development stack and architecture:

- React: For building the user interface and components.
- TypeScript: For type safety and a better development experience.
- Vite: For fast development and optimized builds.
- Redux Toolkit: A set of tools and abstractions for Redux. Redux Toolkit is used for managing global state.
- React-Redux (Hooks): To interact with the Redux store in components, dispatching actions to update state and selecting state to read data.
- Feature-Sliced Design (Architecture): FSD guides how the project structure is organized.
- Firebase (Auth & Firestore): A Backend-as-a-Service platform by Google. Firebase Authentication is used to manage user accounts and login sessions securely without building a custom auth server. Firebase was also chosen for its easy integration and ability to deploy the frontend to Firebase Hosting.
- React Router: A client-side routing library for React.
- SCSS modules: The styling of the app is done with SCSS Modules for scoped styles.
- Testing: Unit tests are implemented using Jest, along with React Testing Library ensure that UI components and state management logic function correctly and consistently, enhancing the app's reliability and maintainability.

# Requirements

- Node.js >= 18.0.0
- NPM >= 9.0.0
- Firebase Account (Optional for full functionality): To utilize authentication and cloud storage, you should have a Firebase project set up. You will need the Firebase project configuration details (API key, Auth domain, Project ID, etc.). These are typically provided in Firebase’s project settings. For local development, you’ll need to provide these in an environment file so the app can initialize Firebase. (The repository may include a .env file where you can put these values, or you may create one based on provided examples.) Note: If you run the application without configuring Firebase, the app may still start, but login and data persistence will not function. It’s recommended to set up Firebase or modify the code to use a local stub if you want to run without Firebase.

# Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies: npm install
4. Run the Development Server:
   Start the Vite dev server with:

   npm run dev

This will launch the app on a local development server (by default at http://localhost:5173). Once the server is running, open your web browser and navigate to that URL. You should see the Web Calendar application load.

5. Run Tests (Optional): If you want to run the unit tests to verify everything is working correctly, you can execute:
   npm run test

6. Live Application
   The application has been successfully deployed to Firebase Hosting. You can access the live Web Calendar application here:

# Project Structure

The project is organized in a feature-sliced manner within the src/ directory.

Calendar/
├── public/ # Public assets and static files
├── src/
│ ├── @types/ # Custom TypeScript definitions
│ ├── app/ # Application setup layer
│ │ ├── styles/ # Global stylesheets (App.css, index.css)
│ │ ├── types/ # Global type definitions
│ │ ├── App.tsx # Root component
│ │ ├── appHooks.ts # Custom hooks for application
│ │ ├── main.tsx # Entry point
│ │ └── store.ts # Redux store configuration
│ │
│ ├── features/ # Feature-specific units
│ │ ├── auth/ # Authentication logic
│ │ │ ├── model/ # Redux slice and services
│ │ │ │ ├── authSlice.ts
│ │ │ │ ├── authService.ts
│ │ │ │ └── tests
│ │ │ └── ui/ # Components related to auth
│ │ │ └── AuthProvider.tsx
│ │ ├── calendars/ # Calendar management
│ │ │ ├── api/hooks/ # Custom hooks for calendars
│ │ │ ├── ui/ # Calendar forms and components
│ │ │ ├── calendarsSlice.ts
│ │ │ └── selectors.ts
│ │ ├── day/ # Day view logic
│ │ │ └── daySlice.ts
│ │ ├── events/ # Event management
│ │ │ ├── api/hooks/ # Custom hooks for events
│ │ │ └── ui/ # Event components and forms
│ │ └── week/ # Week view logic
│ │ └── weekSlice.ts
│ │
│ ├── pages/ # Application views/routes
│ │ ├── DayView/
│ │ ├── WeekView/
│ │ └── WelcomePage/
│ │
│ ├── shared/ # Shared resources
│ │ ├── api/ # Common API utilities
│ │ ├── hooks/ # Shared custom hooks
│ │ ├── icons/ # SVG icons
│ │ ├── providers/ # Context providers
│ │ ├── styles/ # Shared SCSS styles
│ │ ├── ui/ # UI components and context
│ │ └── utils/ # Utility functions
│ │
│ └── widgets/ # Complex UI sections
│ ├── Aside/
│ └── Header/
│
├── .env # Environment variables
├── .gitignore
├── .npmrc
├── eslint.config.js
├── index.html
├── jest.config.cjs
├── jest.setup.ts
├── package-lock.json
├── package.json
└── README.md # Project documentation

# How It Works

- Authentication & Authorization: The application uses Firebase Authentication for secure login and logout functionality. When a user accesses the application, the authService checks authentication status. If the user is not authenticated, they are redirected to the WelcomePage component for login.

- Data Flow & State Management: Redux Toolkit manages the global application state, including user data, calendars, events, and UI preferences. Each major domain (auth, calendars, events, views) has its own Redux slice to handle state clearly and predictably.

- Displaying Calendars and Events: The application fetches and manages events and calendars data from Firebase Firestore. Components such as DayView, WeekView, and widgets like Aside and Header display calendars and events. Events appear color-coded according to their respective calendars, providing quick visual reference.

- Adding Calendars and Events: Users add calendars and events through dedicated forms (CreateCalendarForm, CreateEventForm). Upon submission, hooks like useCreateCalendar or useCreateEvent trigger state updates and persist data to Firebase, reflecting changes instantly in the UI.

- Editing Calendars and Events: The application allows editing calendars and events via forms (UpdateCalendarForm, UpdateEventForm). Users can update event details or calendar settings, and changes immediately synchronize with Firebase, ensuring consistency across sessions.

- Deleting Calendars and Events: Users can delete calendars and events through specific confirmation forms (DeleteCalendarConfirmForm, DeleteEventConfirmForm). Deleted items are removed instantly from both the UI and Firebase Firestore.

- Toggle Calendar Visibility: Each calendar has a visibility checkbox. Users toggle these checkboxes to quickly show or hide all associated events in the calendar view. This functionality only affects visibility and does not delete or modify the data.

- Date and Time Navigation: Users navigate dates using widgets like the header navigation controls and date selectors. Changing dates or switching between views (Day or Week) updates the application state, prompting the UI to show relevant events immediately.

- Repeat Events Functionality: Users can create recurring events, defining patterns (daily, weekly, etc.). The app dynamically calculates event instances, displaying recurring events on their scheduled dates without needing manual entry for each occurrence.

- Current Time Indicator: A red line indicates the current time on calendar views. This line dynamically updates every minute, providing users with immediate visual feedback about the current time in relation to their scheduled events.

- Theme Switching: The application includes a toggle to switch between dark and light modes. When toggled, the global theme state updates instantly, changing UI colors across all components and persisting user preferences for future visits.

- Unit Testing: Jest and React Testing Library are employed to ensure component and logic correctness. Test suites validate critical functionality, reducing the likelihood of regressions and ensuring the application behaves consistently.

- Deployment: The Web Calendar app is deployed to Firebase Hosting. Users can access the fully functional app directly through the hosted URL, with all features available online.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

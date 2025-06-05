import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "shared/providers/ThemeContext";
import { ModalProvider } from "shared/ui/context/ModalContext";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import WelcomePage from "pages/WelcomePage/WelcomePage";
import WeekView from "pages/WeekView/WeekView";
import DayView from "pages/DayView/DayView";
import AuthProvider from "features/auth/ui/AuthProvider";
import store from "./store";
import "./styles/index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <WelcomePage />,
      },
      {
        path: "weekView",
        element: <WeekView />,
      },
      {
        path: "dayView",
        element: <DayView />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <ModalProvider>
            <RouterProvider router={router} />
          </ModalProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);

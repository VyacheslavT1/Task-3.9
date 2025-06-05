import { Outlet, useLocation } from "react-router-dom";
import Header from "widgets/Header/Header";
import { useCalendarsListener } from "features/calendars/api/hooks/useCalendarsListener";

import "./styles/App.css";

function App() {
  const location = useLocation();
  useCalendarsListener();
  return (
    <div className="appWrapper">
      {location.pathname !== "/" && <Header />}
      <Outlet />
    </div>
  );
}

export default App;

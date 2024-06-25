import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./users/pages/users/Users";
// import NewPlace from "./places/pages/newPlace/NewPlace";
// import UserPlaces from "./places/pages/userPlaces/UserPlaces";
// import UpdatePlace from "./places/pages/updatePlace/UpdatePlace";
// import Authenticate from "./users/pages/authenticate/Authenticate";
import MainNavigation from "./shared/components/navigation/mainNavigation/MainNavigation";
import { AuthenticateContext } from "./shared/context/authenticateContext";
import { useAuth } from "./shared/hooks/authHook/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/loadingSpinner/LoadingSpinner";

const NewPlace = React.lazy(() => import("./places/pages/newPlace/NewPlace"));
const UserPlaces = React.lazy(() =>
  import("./places/pages/userPlaces/UserPlaces")
);
const UpdatePlace = React.lazy(() =>
  import("./places/pages/updatePlace/UpdatePlace")
);
const Authenticate = React.lazy(() =>
  import("./users/pages/authenticate/Authenticate")
);

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/authenticate">
          <Authenticate />
        </Route>
        <Redirect to="/authenticate" />
      </Switch>
    );
  }

  return (
    <AuthenticateContext.Provider
      value={{ isLoggedIn: !!token, token, userId, login, logout }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center" style={{ minHeight: "70vh" }}>
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthenticateContext.Provider>
  );
};

export default App;

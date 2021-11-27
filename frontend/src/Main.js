import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Home from './Components/Home';
import EditForm from './Components/Form/EditForm';
import Login from './Components/LoginSignupPage';
import PrivateRoute from './Components/util/PrivateRoute';
import UserView from './Components/StudentFormView/UserView';
import CourseView from './Components/Course/CourseView';
import LandingPage from './Components/LandingPage';
import Error from './Components/Errors/Error.js';
import Forbidden from './Components/Errors/Forbidden.js';

/***
 * The main component of the app.
 * 
 * Each of the requests get in through this component to their respected components.
 */
function Main() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Login} />
          <Route exact path="/error" component={Error} />
          <Route exact path="/forbidden" component={Forbidden} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute path="/course/:courseId" component={CourseView} />
          <PrivateRoute path="/form/:formId" component={EditForm} />
          <PrivateRoute exact path="/s/:formId" component={UserView} />
        </Switch>
      </Router>
    </div>
  );
}

export default Main;

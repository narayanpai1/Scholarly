import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home';
import auth from './services/authService';
import EditForm from './Components/Form/EditForm';
import Login from './Components/Login';
import PrivateRoute from './Components/util/PrivateRoute';
import UserView from './Components/StudentFormView/UserView';
import CourseView from './Components/Course/CourseView';
import LandingPage from './Components/LandingPage';

function Main() {
  return (
    <div>
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Login} />
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

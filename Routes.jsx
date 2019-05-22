import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'

import LoadingScreen from './components/LoadingScreen'

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: () => <LoadingScreen />
})

const Login = Loadable({
  loader: () => import('./pages/Login'),
  loading: () => <LoadingScreen />
})

const Profile = Loadable({
  loader: () => import('./pages/Profile'),
  loading: () => <LoadingScreen />
})

const RetrieveSingle = Loadable({
  loader: () => import('./pages/RetrieveSingle'),
  loading: () => <LoadingScreen />
})

const RetrieveMultiple = Loadable({
  loader: () => import('./pages/RetrieveMultiple'),
  loading: () => <LoadingScreen />
})

const SignOut = Loadable({
  loader: () => import('./pages/SignOut'),
  loading: () => <LoadingScreen />
})

export default function Routes({ childProps }) {
  return (
    <Switch>
      <Route exact path="/" component={Home} props={childProps} />
      <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} />
      <AuthenticatedRoute
        exact
        path="/profile"
        component={Profile}
        props={childProps}
      />
      <AuthenticatedRoute
        exact
        path="/retrieve-single"
        component={RetrieveSingle}
        props={childProps}
      />
      <AuthenticatedRoute
        exact
        path="/retrieve-multiple"
        component={RetrieveMultiple}
        props={childProps}
      />
      <AuthenticatedRoute
        exact
        path="/sign-out"
        component={SignOut}
        props={childProps}
      />
    </Switch>
  )
}

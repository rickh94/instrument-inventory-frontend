import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import { AuthenticatedRoute, UnauthenticatedRoute, LoadingScreen } from './components'

import NotFound from './pages/NotFound'

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

const Create = Loadable({
  loader: () => import('./pages/Create'),
  loading: () => <LoadingScreen />
})

const Single = Loadable({
  loader: () => import('./pages/Single'),
  loading: () => <LoadingScreen />
})

const Search = Loadable({
  loader: () => import('./pages/Search'),
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
        path="/retrieve-single/:number"
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
      <AuthenticatedRoute
        exact
        path="/sign-out/:number"
        component={SignOut}
        props={childProps}
      />
      <AuthenticatedRoute exact path="/create" component={Create} props={childProps} />
      <AuthenticatedRoute
        exact
        path="/instrument/:recId"
        component={Single}
        props={childProps}
      />
      <AuthenticatedRoute exact path="/search" component={Search} props={childProps} />
      <Route default component={NotFound} />
    </Switch>
  )
}

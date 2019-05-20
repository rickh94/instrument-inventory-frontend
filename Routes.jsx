import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import UnauthenticatedRoute from './components/UnauthenticatedRoute'
import AuthenticatedRoute from './components/AuthenticatedRoute'

const Home = Loadable({
  loader: () => import('./pages/Home'),
  loading: () => <div>Loading</div>
})

const Login = Loadable({
  loader: () => import('./pages/Login'),
  loading: () => <div>Loading...</div>
})

const Profile = Loadable({
  loader: () => import('./pages/Profile'),
  loading: () => <div>Loading...</div>
})

const RetrieveSingle = Loadable({
  loader: () => import('./pages/RetrieveSingle'),
  loading: () => <div>Loading...</div>
})

const RetrieveMultiple = Loadable({
  loader: () => import('./pages/RetrieveMultiple'),
  loading: () => <div>Loading...</div>
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
    </Switch>
  )
}

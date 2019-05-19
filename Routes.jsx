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

export default function Routes({ childProps }) {
  return (
    <Switch>
      <Route exact path="/" component={Home} props={childProps} />
      <UnauthenticatedRoute exact path="/login" component={Login} props={childProps} />
      <AuthenticatedRoute exact path="/profile" component={Profile} props={childProps} />
    </Switch>
  )
}

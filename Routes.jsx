import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthenticatedRoute, UnauthenticatedRoute } from './components'
import {
  Home,
  Login,
  Profile,
  RetrieveSingle,
  RetrieveMultiple,
  SignOut,
  Create,
  Single,
  Search,
  Filter,
  NotFound,
} from './pages'

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
      <AuthenticatedRoute exact path="/filter" component={Filter} props={childProps} />
      <Route default component={NotFound} />
    </Switch>
  )
}

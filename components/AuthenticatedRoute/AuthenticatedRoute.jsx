import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const AuthenticatedRoute = ({ component: C, props: cProps, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        cProps.isAuthenticated ? (
          <C {...props} {...cProps} />
        ) : (
          <Redirect
            to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          />
        )
      }
    />
  )
}

AuthenticatedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  props: PropTypes.object.isRequired,
}

export default AuthenticatedRoute

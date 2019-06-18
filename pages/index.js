import React from 'react'
import Loadable from 'react-loadable'
import { LoadingScreen } from '../components'
import Login from './Login'

export { Login }

export const Home = Loadable({
  loader: () => import('./Home'),
  loading: () => <LoadingScreen />,
})

// export const Login = Loadable({
//   loader: () => import('./Login'),
//   loading: () => <LoadingScreen />,
// })

export const Profile = Loadable({
  loader: () => import('./Profile'),
  loading: () => <LoadingScreen />,
})

export const RetrieveSingle = Loadable({
  loader: () => import('./RetrieveSingle'),
  loading: () => <LoadingScreen />,
})

export const RetrieveMultiple = Loadable({
  loader: () => import('./RetrieveMultiple'),
  loading: () => <LoadingScreen />,
})

export const SignOut = Loadable({
  loader: () => import('./SignOut'),
  loading: () => <LoadingScreen />,
})

export const Create = Loadable({
  loader: () => import('./Create'),
  loading: () => <LoadingScreen />,
})

export const Single = Loadable({
  loader: () => import('./Single'),
  loading: () => <LoadingScreen />,
})

export const Search = Loadable({
  loader: () => import('./Search'),
  loading: () => <LoadingScreen />,
})

export const Filter = Loadable({
  loader: () => import('./Filter'),
  loading: () => <LoadingScreen />,
})

export const NotFound = Loadable({
  loader: () => import('./NotFound'),
  loading: () => <LoadingScreen />,
})

import Everything from './Everything'
export { Everything }
// export const Everything = Loadable({
//   loader: () => import('./Everything'),
//   loading: () => <LoadingScreen />,
// })

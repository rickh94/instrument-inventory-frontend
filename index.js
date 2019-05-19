import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { BrowserRouter as Router } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'
import teal from '@material-ui/core/colors/teal'
import CssBaseline from '@material-ui/core/CssBaseline'

import Amplify from 'aws-amplify'

import config from './config'

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: 'notes',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      }
    ]
  }
})

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: teal
  },
  typography: {
    useNextVariants: true
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <App />
    </Router>
  </MuiThemeProvider>,
  document.getElementById('root')
)

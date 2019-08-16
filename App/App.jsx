import React, { Component } from 'react'
import 'typeface-roboto'
import Routes from '../Routes'
import { Auth, API } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { Snackbar } from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import { Nav } from '../components'
import config from '../config'
import { HelpersContext, SchemaContext } from '../contexts'

const styles = {
  devMarker: {
    background:
      'repeating-linear-gradient(45deg, #ffa600, #ffa600 20px, #000 20px, #000 40px)',
    height: '20px',
    width: '100%',
    marginBottom: '10px',
    position: 'fixed',
  },
  devSpacer: {
    height: 20,
  },
  devTitle: {
    margin: '0 0 5px 0',
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: '"Open Sans", sans-serif',
  },
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true,
      alert: false,
      alertMessage: '',
      searchResults: [],
      filterResults: [],
    }
  }

  async componentDidMount() {
    try {
      this.setState({ schema: await API.get('instrument-inventory', 'schema') })
      await Auth.currentSession()
      this.userHasAuthenticated(true)
    } catch (e) {
      if (e !== 'No current user') {
        console.error(e)
      }
    }
    this.setState({ isAuthenticating: false })
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated })
  }

  handleLogout = async event => {
    await Auth.signOut()
    this.userHasAuthenticated(false)
  }

  showAlert = alertMessage => {
    this.setState({ alert: true, alertMessage })
  }

  closeAlert = () => {
    this.setState({ alert: false, alertMessage: '' })
  }

  setSearchResults = results => {
    this.setState({ searchResults: results })
  }

  setFilterResults = results => {
    this.setState({ filterResults: results })
  }

  render() {
    const { classes } = this.props
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      // showAlert: this.showAlert,
      // setSearchResults: this.setSearchResults,
      // setFilterResults: this.setFilterResults,
      // searchResults: this.state.searchResults,
      // filterResults: this.state.filterResults,
    }
    return (
      <React.Fragment>
        <Nav
          isAuthenticated={this.state.isAuthenticated}
          handleLogout={this.handleLogout}
        />
        {config.stage === 'dev' && (
          <React.Fragment>
            <div className={classes.devMarker} />
            <div className={classes.devSpacer} />
            <h4 className={classes.devTitle}>Development Mode</h4>
          </React.Fragment>
        )}
        <HelpersContext.Provider
          value={{
            showAlert: this.showAlert,
            setSearchResults: this.setSearchResults,
            setFilterResults: this.setFilterResults,
            searchResults: this.state.searchResults,
            filterResults: this.state.filterResults,
          }}
        >
          <SchemaContext.Provider value={this.state.schema}>
            <Routes childProps={{ ...childProps, schema: this.state.schema }} />
            <Snackbar
              autoHideDuration={2000}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              open={this.state.alert}
              onClose={this.closeAlert}
              message={this.state.alertMessage}
            />
          </SchemaContext.Provider>
        </HelpersContext.Provider>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(App)

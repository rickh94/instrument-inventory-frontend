import React, { Component } from 'react'
import Nav from '../components/Nav'
import 'typeface-roboto'
import Routes from '../Routes'
import { Auth } from 'aws-amplify'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    }
  }

  async componentDidMount() {
    try {
      await Auth.currentSession()
      this.userHasAuthenticated(true)
    } catch (e) {
      if (e !== 'No current user') {
        alert(e)
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
    // this.props.history.push('/login')
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    }
    return (
      <React.Fragment>
        <Nav
          isAuthenticated={this.state.isAuthenticated}
          handleLogout={this.handleLogout}
        />
        <Routes childProps={childProps} />
      </React.Fragment>
    )
  }
}

export default App

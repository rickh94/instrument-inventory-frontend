import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  withStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Input,
  FormHelperText
} from '@material-ui/core'

import EmailIcon from '@material-ui/icons/Email'

import { LoadingHeader, RootPaper } from '../../components'

const style = { }

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      changePassword: false,
      errors: {},
      isLoading: false,
      isLoadingNewPassword: false
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      this.setState({ user: await Auth.currentAuthenticatedUser() })
    } catch (e) {
      console.error(e)
    }
    this.setState({ isLoading: false })
  }

  cancelChangePassword = () => {
    this.setState({
      changePassword: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errors: {}
    })
  }

  validateNewPassword() {
    return (
      this.state.oldPassword.length > 6 &&
      this.state.newPassword1.length > 8 &&
      this.state.newPassword1 === this.state.newPassword2
    )
  }

  changePassword = async e => {
    e.preventDefault()

    if (!this.validateNewPassword()) {
      return
    }

    this.setState({isLoadingNewPassword: true })
    try {
      await Auth.changePassword(
        this.state.user,
        this.state.oldPassword,
        this.state.newPassword1
      )
      this.setState({ changePassword: false })
    } catch (e) {
      if (e.code === 'InvalidPasswordException') {
        this.setState({ errors: { newPassword1: e.message } })
      } else if (e.code === 'NotAuthorizedException') {
        this.setState({ errors: { oldPassword: 'Incorrect Password' } })
      } else {
        console.error(e)
      }
    }
    this.setState({isLoadingNewPassword: false })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <RootPaper>
        <LoadingHeader title="User Profile" isLoading={this.state.isLoading} />
          {this.state.user && (
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="h6">Email</Typography>
                  {this.state.user.attributes.email}
                </ListItemText>
              </ListItem>
              <ListItem>
                <Button onClick={() => this.setState({ changePassword: true })}>
                  Change Password
                </Button>
              </ListItem>
            </List>
          )}
        </RootPaper>
        <Dialog open={this.state.changePassword} onClose={this.cancelChangePassword}>
          <DialogTitle>
            <LoadingHeader isLoading={this.state.isLoadingNewPassword} title="Change Password" />
            </DialogTitle>
          <DialogContent>
            <form onSubmit={this.changePassword}>
              <FormControl
                fullWidth
                error={this.state.errors.oldPassword ? true : false}
              >
                <InputLabel htmlFor="oldpassword">Current Password</InputLabel>
                <Input
                  value={this.state.oldPassword}
                  id="oldpassword"
                  onChange={e => this.setState({ oldPassword: e.target.value })}
                  aria-describedby="old-password-error-text"
                  type="password"
                  required
                  onBlur={() => {
                    if (this.state.oldPassword.length < 6) {
                      this.setState({
                        errors: { oldPassword: 'Please enter current password' }
                      })
                    } else {
                      this.setState({
                        errors: { oldPassword: null }
                      })
                    }
                  }}
                />
                {this.state.errors.oldPassword && (
                  <FormHelperText id="password-error-text1">
                    {this.state.errors.oldPassword}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                error={this.state.errors.newPassword1 ? true : false}
              >
                <InputLabel htmlFor="password1">New Password</InputLabel>
                <Input
                  value={this.state.newPassword1}
                  id="password1"
                  onChange={e => this.setState({ newPassword1: e.target.value })}
                  aria-describedby="password-error-text1"
                  type="password"
                  required
                  onBlur={() => {
                    if (this.state.newPassword1.length < 8) {
                      this.setState({
                        errors: { newPassword1: 'Password is not long enough' }
                      })
                    } else {
                      this.setState({ errors: { newPassword1: null } })
                    }
                  }}
                />
                {this.state.errors.newPassword1 && (
                  <FormHelperText id="password-error-text1">
                    {this.state.errors.newPassword1}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl
                fullWidth
                error={this.state.errors.newPassword2 ? true : false}
              >
                <InputLabel htmlFor="password2">Confirm New Password</InputLabel>
                <Input
                  value={this.state.newPassword2}
                  id="password2"
                  onChange={e => this.setState({ newPassword2: e.target.value })}
                  aria-describedby="password-error-text2"
                  required
                  type="password"
                  onBlur={() => {
                    if (this.state.newPassword2 !== this.state.newPassword1) {
                      this.setState({
                        errors: { newPassword2: 'Passwords do not match' }
                      })
                    } else {
                      this.setState({ errors: { newPassword2: null } })
                    }
                  }}
                />
                {this.state.errors.newPassword2 && (
                  <FormHelperText id="password-error-text2">
                    {this.state.errors.newPassword2}
                  </FormHelperText>
                )}
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.cancelChangePassword}>Cancel</Button>
            <Button
              onClick={this.changePassword}
              disabled={!this.validateNewPassword()}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(style)(Profile)

import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  Button,
  List,
  ListItem,
  FormGroup,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContentText,
  TextField,
  DialogActions,
  DialogContent,
  Paper,
  Grid,
  CircularProgress,
} from '@material-ui/core'
import { Auth } from 'aws-amplify'

import { root, lastButton, fullWidth } from '../../globalStyles'
import { LoadingHeader, RootPaper } from '../../components'

const styles = {
  root,
  lastButton,
  buttons: fullWidth,
}

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      errors: {},
      isLoading: false,
      user: null,
      completeNewPassword: false,
      newPassword1: '',
      newPassword2: '',
      loginError: null,
      isLoadingNewPassword: false,
    }
  }

  static propTypes = {
    userHasAuthenticated: PropTypes.func.isRequired,
    showAlert: PropTypes.func.isRequired,
  }

  handleSubmit = async event => {
    event.preventDefault()

    this.setState({ isLoading: true })

    try {
      const user = await Auth.signIn(this.state.email, this.state.password)
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        this.setState({ user, completeNewPassword: true })
        return
      }
      this.props.userHasAuthenticated(true)
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        this.setState({ loginError: 'Your user is not confirmed' })
      } else if (err.code === 'PasswordResetRequiredException') {
        this.setState({ loginError: 'You need to reset your password' })
      } else if (err.code === 'NotAuthorizedException') {
        this.setState({
          loginError: 'You are not authorized to perform this operation',
        })
      } else if (err.code === 'UserNotFoundException') {
        this.setState({ loginError: 'Could not find user' })
      } else {
        this.setState({ loginError: 'Could not log in' })
      }
      this.setState({ isLoading: false })
    }
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0
  }

  validateNewPassword() {
    return (
      this.state.newPassword1.length > 0 &&
      this.state.newPassword1 === this.state.newPassword2
    )
  }

  completeNewPassword = async newPassword => {
    event.preventDefault()

    this.setState({ isLoadingNewPassword: true })

    try {
      await Auth.completeNewPassword(this.state.user, newPassword)
      this.props.userHasAuthenticated(true)
    } catch (e) {
      if (e.code === 'InvalidPasswordException') {
        this.setState({ errors: { newPassword1: e.message } })
        console.error(e)
      }
      this.setState({ isLoadingNewPassword: false })
    }
  }

  setError = (name, value) =>
    this.setState({ errors: { [name]: value, ...this.state.errors } })

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader isLoading={this.state.isLoading} title="Login" />
          <form onSubmit={this.handleSubmit}>
            <List>
              <ListItem>
                <FormControl fullWidth error={this.state.errors.email ? true : false}>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input
                    id="email"
                    onChange={e => this.setState({ email: e.target.value })}
                    aria-describedby="email-error-text"
                    type="email"
                    value={this.state.email}
                    required
                  />
                  {this.state.errors.email && (
                    <FormHelperText id="email-error-text">
                      {this.state.errors.email}
                    </FormHelperText>
                  )}
                </FormControl>
              </ListItem>
              <ListItem>
                <FormControl
                  fullWidth
                  error={this.state.errors.password ? true : false}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    id="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    aria-describedby="password-error-text"
                    type="password"
                    value={this.state.password}
                    required
                  />
                  {this.state.errors.password && (
                    <FormHelperText id="password-error-text">
                      {this.state.errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
              </ListItem>
              <ListItem>
                <FormGroup row className={classes.buttons}>
                  <Button type="reset" color="secondary" className={classes.lastButton}>
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" disabled={!this.validateForm()}>
                    Login
                  </Button>
                </FormGroup>
              </ListItem>
            </List>
          </form>
        </RootPaper>
        <NewPasswordDialog
          onSubmit={this.completeNewPassword}
          setOpen={completeNewPassword => this.setState({ completeNewPassword })}
          isLoading={this.state.isLoadingNewPassword}
          showAlert={this.props.showAlert}
          errors={this.state.errors}
          setError={this.setError}
          open={this.state.completeNewPassword}
        />
        <Dialog
          open={this.state.loginError ? true : false}
          onClose={() => this.setState({ loginError: null })}
        >
          <DialogTitle>Could not Log in</DialogTitle>
          <DialogContent>{this.state.loginError}</DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ loginError: null })}>Ok</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(Login)


const NewPasswordDialog = ({
  open,
  setOpen,
  isLoading,
  onSubmit,
  showAlert,
  errors,
  setError,
}) => {
  const [newPassword1, setPassword1] = useState('')
  const [newPassword2, setPassword2] = useState('')

  const setFromEvent = setCallback => event => setCallback(event.target.value)

  const handleSubmit = event => {
    event.preventDefault()
    if (!validateForm()) {
      return
    }

    onSubmit(newPassword1)
  }

  const validateForm = () => newPassword1.length > 8 && newPassword1 === newPassword2

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="complete-new-password-title"
    >
      <DialogTitle id="complete-new-password-title">
        <LoadingHeader isLoading={isLoading} title="New Password Required" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To complete Sign In, please select a new password.
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth error={errors.newPassword1 ? true : false}>
            <InputLabel htmlFor="password1">New Password</InputLabel>
            <Input
              id="password1"
              onChange={setFromEvent(setPassword1)}
              aria-describedby="password1-error"
              type="password"
              value={newPassword1}
              onBlur={() => {
                if (newPassword1.length < 8) {
                  setError('newPassword1', 'Password is not long enough')
                } else {
                  setError('newPassword1', null)
                }
              }}
            />
            {errors.newPassword1 && (
              <FormHelperText id="password1-error">
                {errors.newPassword1}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth error={errors.newPassword2 ? true : false}>
            <InputLabel htmlFor="password2">Confirm Password</InputLabel>
            <Input
              id="password2"
              onChange={setFromEvent(setPassword2)}
              aria-describedby="password2-error"
              type="password"
              value={newPassword2}
              onBlur={() => {
                if (newPassword2 !== newPassword1) {
                  setError('newPassword2', 'Passwords do not match')
                } else {
                  setError('newPassword2', null)
                }
              }}
            />
            {errors.newPassword2 && (
              <FormHelperText id="password2-error">
                {errors.newPassword2}
              </FormHelperText>
            )}
          </FormControl>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!validateForm()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

NewPasswordDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showAlert: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  setError: PropTypes.func.isRequired,
}

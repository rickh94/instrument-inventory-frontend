import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
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
  FormHelperText,
  Checkbox,
} from '@material-ui/core'

import EmailIcon from '@material-ui/icons/Email'

import { LoadingHeader, RootPaper } from '../../components'

const style = {}

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
      isLoadingNewPassword: false,
      autoScan: false,
      verifyEmail: false,
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.setState({ user })
    } catch (e) {
      console.error(e)
    }
    const autoScan = JSON.parse(localStorage.getItem('autoScan', 'false'))
    this.setState({ autoScan, isLoading: false })
  }

  cancelChangePassword = () => {
    this.setState({
      changePassword: false,
      oldPassword: '',
      newPassword1: '',
      newPassword2: '',
      errors: {},
      verifyEmail: false,
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

    this.setState({ isLoadingNewPassword: true })
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
    this.setState({ isLoadingNewPassword: false })
  }

  setAutoScan = e => {
    e.preventDefault()
    if (e.target.checked) {
      localStorage.setItem('autoScan', true)
      this.setState({ autoScan: true })
    } else {
      localStorage.setItem('autoScan', false)
      this.setState({ autoScan: false })
    }
  }

  startVerification = async () => {
    try {
      await Auth.verifyCurrentUserAttribute('email')
    } catch (err) {
      console.error(err)
    }

    this.setState({ verifyEmail: true })
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.autoScan}
                      onChange={this.setAutoScan}
                      id="auto-scan"
                    />
                  }
                  label="Automatically Start Scanning"
                />
              </ListItem>
              <ListItem>
                <Button onClick={() => this.setState({ changePassword: true })}>
                  Change Password
                </Button>
                <Button onClick={this.startVerification}>Verify Email</Button>
              </ListItem>
            </List>
          )}
        </RootPaper>
        <VerifyEmailDialog
          open={this.state.verifyEmail}
          setOpen={verifyEmail => this.setState({ verifyEmail })}
          showAlert={this.props.showAlert}
        />
        <Dialog open={this.state.changePassword} onClose={this.cancelChangePassword}>
          <DialogTitle>
            <LoadingHeader
              isLoading={this.state.isLoadingNewPassword}
              title="Change Password"
            />
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
                        errors: { oldPassword: 'Please enter current password' },
                      })
                    } else {
                      this.setState({
                        errors: { oldPassword: null },
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
                        errors: { newPassword1: 'Password is not long enough' },
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
                        errors: { newPassword2: 'Passwords do not match' },
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

const VerifyEmailDialog = ({ open, setOpen, showAlert }) => {
  const [code, setCode] = useState('')
  const [isLoading, setLoading] = useState(false)

  const validateForm = () => (code ? true : false)

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validateForm()) {
      showAlert('Code is required')
      return
    }

    setLoading(true)
    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', code)
      showAlert('Your email has been verified')
    } catch (err) {
      showAlert(`Something has gone wrong ${err}`)
    }

    setLoading(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        <LoadingHeader isLoading={isLoading} title="Verify Email" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          An email has been sent with a verification code, please enter it below
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel htmlFor="code">Verification Code</InputLabel>
            <Input
              value={code}
              id="code"
              onChange={e => setCode(e.target.value)}
              type="text"
              required
            />
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

VerifyEmailDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
}

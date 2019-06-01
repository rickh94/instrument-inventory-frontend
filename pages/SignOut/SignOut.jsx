import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  withStyles,
  FormControl,
  Input,
  InputAdornment,
  FormHelperText,
  IconButton,
  InputLabel,
  Button,
  NativeSelect,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'

import { LoadingHeader, RootPaper, Scanner, Fields } from '../../components'
import { centerStuff, lastButton, fullWidth } from '../../globalStyles'
import { API } from 'aws-amplify'

const styles = {
  centerButtons: centerStuff,
  lastButton,
  buttons: fullWidth,
}

class SignOut extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentNumber: '',
      school: '',
      studentName: '',
      scanning: false,
      isLoading: false,
      response: '',
      errors: {},
    }
  }

  componentDidMount() {
    const { number } = this.props.match.params
    if (number) {
      this.setState({ instrumentNumber: number })
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm) {
      return
    }

    this.setState({ isLoading: true })

    const { instrumentNumber, school, studentName } = this.state

    try {
      const response = await API.post('instrument-inventory', 'sign-out', {
        body: {
          instrumentNumber,
          school,
          studentName,
        },
      })
      this.setState({ response })
    } catch (err) {
      if (err.response.data.errors.instrumentNumber) {
        this.setState({
          errors: { instrumentNumber: err.response.data.errors.instrumentNumber },
        })
      }
      console.error(err.response)
    }
    this.setState({ isLoading: false })
  }

  validateForm = () => {
    return this.state.instrumentNumber && this.state.school && this.state.studentName
  }

  onDetected = result => {
    if (result.codeResult.code !== this.state.instrumentNumber) {
      this.setState({ instrumentNumber: result.codeResult.code, scanning: false })
    }
  }

  clearForm = () => {
    this.setState({
      instrumentNumber: '',
      school: '',
      studentName: '',
      scanning: false,
      response: '',
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Sign Out an Instrument"
          />
          <form onSubmit={this.handleSubmit}>
            <Fields.Scanner
              label="Instrument Number"
              error={this.state.errors.instrumentNumber}
              value={this.state.instrumentNumber}
              setValue={value => this.setState({ instrumentNumber: value })}
            />
            <FormControl fullWidth error={this.state.errors.studentName ? true : false}>
              <InputLabel htmlFor="student-name">Student Name</InputLabel>
              <Input
                id="student-name"
                onChange={e => this.setState({ studentName: e.target.value })}
                aria-describedby="student-name-error"
                type="text"
                value={this.state.studentName}
                required
              />
              {this.state.errors.studentName && (
                <FormHelperText id="student-name-error">
                  {this.state.errors.studentName}
                </FormHelperText>
              )}
            </FormControl>
            <Fields.LocationSelect
              value={this.state.school}
              onChange={e => this.setState({ school: e.target.value })}
            />
            <FormGroup row>
              <Button onClick={this.clearForm} className={classes.lastButton}>
                Clear
              </Button>
              <Button type="submit" color="primary" disabled={!this.validateForm()}>
                Submit
              </Button>
            </FormGroup>
          </form>
        </RootPaper>
        <Dialog open={this.state.response ? true : false} onClose={this.clearForm}>
          <DialogContent>
            <DialogContentText>{this.state.response}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.history.push('/')}>Return Home</Button>
            <Button onClick={this.clearForm}>Continue</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

SignOut.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
}

export default withStyles(styles)(SignOut)

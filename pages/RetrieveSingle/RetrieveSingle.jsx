import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import {
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  InputLabel,
  Input,
  FormGroup,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  InputAdornment,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API } from 'aws-amplify'

import { Scanner, LoadingHeader, RootPaper, Fields } from '../../components'
import { lastButton, fullWidth } from '../../globalStyles'

const styles = {
  lastButton,
  buttons: fullWidth,
}

class RetrieveSingle extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentNumber: '',
      error: '',
      ask: false,
      isLoading: false,
      recId: '',
    }
  }

  componentDidMount() {
    const { number } = this.props.match.params
    if (number) {
      this.setState({ instrumentNumber: number })
    }
  }

  retrieveAnother = () => {
    this.setState({ instrumentNumber: '', ask: false })
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.state.instrumentNumber) {
      this.setState({ error: 'Please Provide an instrument number' })
      return
    }

    this.setState({ isLoading: true })

    try {
      const res = await API.post('instrument-inventory', 'retrieve-single', {
        body: { instrumentNumber: this.state.instrumentNumber.toUpperCase() },
      })
      this.setState({ ask: true, recId: res.id })
    } catch (err) {
      this.setState({ error: err.response.data })
      console.error(err)
    }
    this.setState({ isLoading: false })
  }

  render() {
    const { classes } = this.props
    const { isLoading, instrumentNumber, error, ask, recId } = this.state
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader isLoading={isLoading} title="Retrieve an Instrument" />
          <form onSubmit={this.handleSubmit}>
            <Fields.Scanner
              label="Instrument Number"
              value={instrumentNumber}
              setValue={value => this.setState({ instrumentNumber: value })}
              error={error}
            />
            <FormGroup row className={classes.buttons}>
              <Button
                onClick={() => this.setState({ instrumentNumber: '', scanning: false })}
                className={classes.lastButton}
              >
                Clear
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </FormGroup>
          </form>
        </RootPaper>
        <Dialog open={ask} onClose={this.retrieveAnother}>
          <DialogContent>
            <DialogContentText>
              Instrument {instrumentNumber} marked retrieved.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.retrieveAnother}>Continue</Button>
            <Button onClick={() => this.props.history.push(`/instrument/${recId}`)}>
              View Instrument
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

RetrieveSingle.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object,
}

export default withStyles(styles)(RetrieveSingle)

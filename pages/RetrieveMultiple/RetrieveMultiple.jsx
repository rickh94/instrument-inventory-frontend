import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  FormControl,
  InputLabel,
  Input,
  Button,
  InputAdornment,
  IconButton,
  ListItem,
  List,
  ListItemText,
  ListItemSecondaryAction,
  FormGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  FormHelperText,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

import DeleteIcon from '@material-ui/icons/Delete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API } from 'aws-amplify'

import { Scanner, LoadingHeader, RootPaper } from '../../components'
import { lastButton, centerStuff } from '../../globalStyles'
import { red } from '@material-ui/core/colors'

const styles = {
  lastButton,
  buttons: {
    width: '100%',
    display: 'flex',
  },
  centerButtons: centerStuff,
}

class RetrieveMultiple extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentList: [],
      scanning: false,
      error: null,
      instrumentNumber: '',
      message: { new: false, successList: [], failureList: [] },
      isLoading: false,
    }
  }

  onDetected = result => {
    const item = result.codeResult.code
    if (!this.state.instrumentList.includes(item)) {
      this.addToList(item)
    }
  }

  addToListFromForm = e => {
    e.preventDefault()
    this.addToList(this.state.instrumentNumber)
    this.setState({ instrumentNumber: '' })
  }

  addToList = item => {
    if (item) {
      this.setState({
        instrumentList: this.state.instrumentList.concat([item.toUpperCase()]),
      })
    }
  }

  removeInstrumentIndex = idx => {
    let instrumentListCopy = this.state.instrumentList.slice(
      0,
      this.state.instrumentList.length
    )
    instrumentListCopy.splice(idx, 1)
    this.setState({ instrumentList: instrumentListCopy })
  }

  dismissMessage = () => {
    this.setState({ message: { new: false, successList: [], failureList: [] } })
  }

  handleSubmit = async e => {
    e.preventDefault()
    if (this.state.instrumentList.length < 1) {
      this.setState({ error: 'Please provide an instrument' })
      return
    }

    this.setState({ isLoading: true })

    try {
      const res = await API.post('instrument-inventory', 'retrieve-multiple', {
        body: { instrumentNumbers: this.state.instrumentList },
      })
      const successList = res.instrumentsUpdated.join(', ')
      const failureList = []
      res.instrumentsFailed.forEach(item => {
        failureList.push(`${item.number}: ${item.error}`)
      })
      this.setState({ message: { successList, failureList, new: true } })
    } catch (err) {
      console.error(err)
    }
    this.setState({ isLoading: false, instrumentList: [] })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <RootPaper>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title="Retrieve Multiple Instruments"
          />
          {this.state.scanning ? (
            <div>
              <Scanner onDetected={this.onDetected} />{' '}
              <div className={classes.centerButtons}>
                <Button onClick={() => this.setState({ scanning: false })}>
                  Stop Scanning
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={this.addToListFromForm} style={{ width: '100%' }}>
              <FormControl fullWidth>
                <InputLabel htmlFor="instrument-number">Instrument Number</InputLabel>
                <Input
                  id="instrument-number"
                  onChange={e => this.setState({ instrumentNumber: e.target.value })}
                  type="text"
                  value={this.state.instrumentNumber}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          this.setState({ scanning: !this.state.scanning })
                        }
                      >
                        <FontAwesomeIcon icon={faBarcode} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div className={classes.buttons}>
                <Button onClick={this.addToListFromForm} className={classes.lastButton}>
                  Add
                </Button>
              </div>
            </form>
          )}
          <Typography variant="h6" align="center">
            Instruments to Retrieve
          </Typography>
          <List>
            {this.state.instrumentList.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText>{item}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Delete"
                    onClick={() => this.removeInstrumentIndex(idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <FormGroup row className={classes.centerButtons}>
            <Button onClick={() => this.setState({ instrumentList: [] })}>
              Clear All
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </FormGroup>
        </RootPaper>
        <Dialog
          open={this.state.error ? true : false}
          onClose={() => this.setState({ error: null })}
        >
          <DialogContent>
            <DialogContentText>{this.state.error}</DialogContentText>
            <DialogActions>
              <Button onClick={() => this.setState({ error: null })}>OK</Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.message.new ? true : false}
          onClose={this.dismissMessage}
        >
          <DialogContent>
            <DialogContentText>
              {this.state.message.successList.length > 0 && (
                <React.Fragment>
                  <strong>Instruments Succeeded:</strong>{' '}
                  {this.state.message.successList}
                </React.Fragment>
              )}
              {this.state.message.failureList.length > 0 && (
                <React.Fragment>
                  <br />
                  <strong>Instruments Failed</strong>
                  {this.state.message.failureList.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <br />
                      {item}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.dismissMessage} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

RetrieveMultiple.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(RetrieveMultiple)

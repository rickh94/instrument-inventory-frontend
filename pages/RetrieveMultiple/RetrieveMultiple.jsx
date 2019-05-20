import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  withStyles,
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
  DialogTitle
} from '@material-ui/core'

import Scanner from '../../components/Scanner'

import DeleteIcon from '@material-ui/icons/Delete'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBarcode } from '@fortawesome/free-solid-svg-icons'
import { API } from 'aws-amplify'

const styles = {
  root: {
    padding: '1rem',
    margin: '1rem auto',
    maxWidth: 700
  },
  lastButton: {
    marginLeft: 'auto'
  },
  buttons: {
    width: '100%',
    display: 'flex'
  },
  centerButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around'
  }
}

class RetrieveMultiple extends Component {
  constructor(props) {
    super(props)

    this.state = {
      instrumentList: [],
      scanning: false,
      error: null,
      instrumentNumber: '',
      message: null
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
    this.setState({
      instrumentList: this.state.instrumentList.concat([item.toUpperCase()])
    })
  }

  removeInstrumentIndex = idx => {
    let instrumentListCopy = this.state.instrumentList.slice(
      0,
      this.state.instrumentList.length
    )
    instrumentListCopy.splice(idx, 1)
    this.setState({ instrumentList: instrumentListCopy })
  }

  handleSubmit = async e => {
    e.preventDefault()
    this.setState({ error: 'Please provide an instrument' })

    try {
      const res = await API.post('instrument-inventory', 'retrieve-multiple', {
        body: { instrumentNumbers: this.state.instrumentList }
      })
      console.log(res)
    } catch (err) {
      console.error(err)
    }
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Typography variant="h5">Retrieve Multiple Instruments</Typography>
          {this.state.scanning ? (
            <div>
              <Scanner onDetected={this.onDetected} />{' '}
              <Button onClick={() => this.setState({ scanning: false })}>
                Stop Scanning
              </Button>
            </div>
          ) : (
            <form onSubmit={this.addToListFromForm} style={{ width: '100%' }}>
              <FormControl fullWidth error={this.state.error ? true : false}>
                <InputLabel htmlFor="instrument-number">Instrument Number</InputLabel>
                <Input
                  id="instrument-number"
                  onChange={e => this.setState({ instrumentNumber: e.target.value })}
                  aria-describedby="instrument-number-error"
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
                {this.state.error && (
                  <FormHelperText id="instrument-number-error">
                    {this.state.error}
                  </FormHelperText>
                )}
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
        </Paper>
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
          open={this.state.message ? true : false}
          onClose={() => this.setState({ message: null })}
        >
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <DialogContentText>{this.state.message}</DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    )
  }
}

RetrieveMultiple.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(RetrieveMultiple)

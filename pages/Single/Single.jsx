import React, { Component, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  withStyles,
  FormControl,
  Input,
  List,
  ListItem,
  ListItemText,
  Grid,
  Modal,
  Dialog,
  DialogContent,
  Button,
  DialogActions,
  makeStyles,
  DialogTitle,
} from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import InputIcon from '@material-ui/icons/Input'
import LabelIcon from '@material-ui/icons/Label'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import CameraIcon from '@material-ui/icons/PhotoCamera'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { API, Storage } from 'aws-amplify'

import {
  LoadingHeader,
  LoadingScreen,
  RootPaper,
  InstrumentDisplay,
  InstrumentForm,
} from '../../components'
import { s3Upload } from '../../libs/awsLib'
import { titleCase } from '../../libs/titleCase'
import processImage from '../../libs/processImage'

const styles = theme => ({
  fileInput: {
    display: 'none',
  },
})

const emptyForm = {
  instrumentNumber: '',
  instrumentType: '',
  size: '',
  location: '',
  assignedTo: '',
  maintenanceNotes: '',
  conditionNotes: '',
  condition: '',
  quality: '',
  rosin: false,
  bow: false,
  shoulderRestRockStop: false,
  readyToGo: false,
  gifted: false,
  photo: null,
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

class Single extends Component {
  constructor(props) {
    super(props)

    this.state = {
      number: '',
      thumbnailUrl: '',
      fullPhotoUrl: '',
      instrumentType: '',
      size: '',
      location: '',
      assignedTo: '',
      condition: null,
      quality: null,
      conditionNotes: '',
      maintenanceNotes: '',
      rosin: true,
      bow: true,
      readyToGo: true,
      shoulderRestEndpinRest: true,
      giftedToStudent: true,
      isLoading: false,
      photo: null,
      photoFormOpen: false,
      errors: {},
      initialLoad: true,
      editing: false,
    }
  }

  async componentDidMount() {
    await this.getInstrument()
  }

  getInstrument = async () => {
    this.setState({ isLoading: true })
    const { recId } = this.props.match.params
    try {
      const record = await API.get('instrument-inventory', `instruments/${recId}`)
      const { fields } = record
      this.setState({
        instrumentType: fields['Instrument Type'],
        instrumentNumber: fields.Number,
        size: fields.Size || '',
        location: fields.Location || '',
        assignedTo: fields['Assigned To'] || '',
        condition: fields.Condition || '',
        quality: fields.Quality || '',
        conditionNotes: fields['Condition Notes'] || '',
        maintenanceNotes: fields['Maintenance Notes'] || '',
        rosin: fields.Rosin || false,
        bow: fields.Bow || false,
        readyToGo: fields['Ready To Go'] || false,
        shoulderRestEndpinRest: fields['Shoulder Rest/Endpin Rest'] || false,
        giftedToStudent: fields['Gifted to student'] || false,
        isLoading: false,
        initialLoad: false,
      })
      if (fields.Photo) {
        this.setState({
          thumbnailUrl: fields.Photo[0].thumbnails.small.url,
          fullPhotoUrl: fields.Photo[0].url,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.validateForm()) {
      return
    }

    this.setState({ isLoading: true })

    let {
      instrumentNumber,
      instrumentType,
      size,
      location,
      assignedTo,
      maintenanceNotes,
      conditionNotes,
      condition,
      quality,
      rosin,
      bow,
      shoulderRestEndpinRest,
      readyToGo,
      gifted,
      photo,
    } = this.state

    condition = parseInt(`${condition}`)
    quality = parseInt(`${quality}`)

    try {
      let fields = {
        instrumentNumber,
        instrumentType,
        size,
        location,
        assignedTo,
        maintenanceNotes,
        conditionNotes,
        condition,
        quality,
        rosin,
        bow,
        shoulderRestEndpinRest,
        readyToGo,
        gifted,
      }

      const response = await API.patch(
        'instrument-inventory',
        `instruments/${this.props.match.params.recId}`,
        {
          body: fields,
        }
      )
      this.setState({ editing: false })
    } catch (err) {
      console.error(err)
      if (err.response.data.errors) {
        this.setState({ errors: err.response.data.errors })
      }
      console.error(err.response)
    }

    this.setState({ isLoading: false })
  }

  cancelEdit = () => {
    this.setState({ editing: false })
  }

  setErrors = (name, value) => {
    this.setState({ [name]: value, ...this.state.errors })
  }

  validateForm = () => {
    if (!this.state.instrumentNumber) {
      return false
    }
    if (!this.state.instrumentType) {
      return false
    }
    if (!this.state.size) {
      return false
    }
    if (!this.state.location) {
      return false
    }
    if (this.state.errors.condition) {
      return false
    }
    if (this.state.errors.quality) {
      return false
    }
    return true
  }

  setValue = (name, value) => {
    this.setState({ [name]: value })
  }

  showPhoto = () => {
    this.setState({ viewPhoto: true })
  }

  handlePhoto = event => {
    this.setState({isLoading: true})
    processImage(event.target.files[0], this.setPhoto)
  }

  setPhoto = photo => {
    this.setState({ photo, isLoading: false })
  }

  uploadPhoto = async e => {
    e.preventDefault()

    if (!this.state.photo) {
      this.setState({ errors: { photo: 'Photo is required' } })
      return
    }

    if (this.state.photo.size > 5000000) {
      this.props.showAlert('Photo is too large')
      // this.setState({ errors: { photo: 'Photo is too large. Choose Photo under 5MB' } })
      return
    }

    try {
      this.setState({ isLoading: true })
      const uploadedPhoto = await s3Upload(this.state.photo)
      const photoUrl = await Storage.vault.get(uploadedPhoto)

      const response = await API.patch(
        'instrument-inventory',
        `instruments/${this.props.match.params.recId}/photo`,
        { body: { photoUrl } }
      )
      this.setState({ photo: null, photoFormOpen: false })
    } catch (err) {
      console.error(err)
      if (err.response.data.errors) {
        this.setState({ errors: err.response.data.errors })
      }
    }
    this.setState({ isLoading: false })
  }

  render() {
    const { instrumentNumber } = this.state
    const actions = {
      onRetrieve: () => {
        this.props.history.push(`/retrieve-single/${instrumentNumber}`)
      },
      onSignOut: () => {
        this.props.history.push(`/sign-out/${instrumentNumber}`)
      },
      onEdit: () => {
        this.setState({ editing: true })
      },
      onAddPhoto: () => {
        this.setState({ photoFormOpen: true })
      },
    }

    const { classes } = this.props
    const {
      actionsOpen,
      initialLoad,
      editing,
      photoFormOpen,
      errors,
      isLoading,
    } = this.state
    return (
      <React.Fragment>
        {initialLoad ? (
          <LoadingScreen />
        ) : (
          <React.Fragment>
            <RootPaper>
              {editing ? (
                <React.Fragment>
                  <LoadingHeader isLoading={isLoading} title="Edit Instrument" />
                  <InstrumentForm
                    {...this.state}
                    onSubmit={this.handleSubmit}
                    setValue={this.setValue}
                    setErrors={this.setErrors}
                    validateForm={this.validateForm}
                    onCancel={this.cancelEdit}
                    buttonsLeft
                  />
                </React.Fragment>
              ) : (
                <InstrumentDisplay {...this.state} />
              )}
            </RootPaper>
          </React.Fragment>
        )}
        <SingleActions {...actions} />
        <Dialog open={photoFormOpen}>
          <DialogTitle>
            <LoadingHeader
              title="Add/Change Instrument Photo"
              isLoading={this.state.isLoading}
            />
          </DialogTitle>
          <DialogContent>
            {this.state.photo && <p>Photo: {this.state.photo.name}</p>}
            <form onSubmit={this.uploadPhoto}>
              <input
                accept="image/*"
                id="upload-photo"
                type="file"
                className={classes.fileInput}
                onChange={this.handlePhoto}
              />
              <FormControl fullWidth error={errors.photo ? true : false}>
                <label htmlFor="upload-photo">
                  <Button variant="contained" component="span" color="primary">
                    Choose Photo
                  </Button>
                </label>
                {errors.photo && (
                  <FormHelperText id="photo-error">{errors.photo}</FormHelperText>
                )}
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ photoFormOpen: false })}
              className={classes.lastButton}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={this.state.photo ? false : true}
              onClick={this.uploadPhoto}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    )
  }
}

Single.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default withStyles(styles)(Single)

const singleActionsStyles = makeStyles(theme => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}))

const SingleActions = ({ onRetrieve, onSignOut, onEdit, onAddPhoto }) => {
  const [isOpen, setOpen] = useState(false)
  const classes = singleActionsStyles()
  const open = () => setOpen(true)
  const close = () => setOpen(false)
  const toggle = () => setOpen(!isOpen)

  return (
    <SpeedDial
      ariaLabel="actions"
      icon={<SpeedDialIcon />}
      onBlur={close}
      onClick={toggle}
      onClose={close}
      onFocus={open}
      onMouseEnter={open}
      onMouseLeave={close}
      open={isOpen}
      direction="up"
      className={classes.speedDial}
    >
      <SpeedDialAction
        icon={<InputIcon />}
        tooltipTitle="Retrieve"
        tooltipOpen={isOpen}
        onClick={onRetrieve}
      />
      <SpeedDialAction
        icon={<LabelIcon />}
        tooltipTitle="Sign Out"
        tooltipOpen={isOpen}
        onClick={onSignOut}
      />
      <SpeedDialAction
        icon={<EditIcon />}
        tooltipTitle="Edit"
        tooltipOpen={isOpen}
        onClick={onEdit}
      />
      <SpeedDialAction
        icon={<CameraIcon />}
        tooltipTitle="Add Photo"
        tooltipOpen={isOpen}
        onClick={onAddPhoto}
      />
    </SpeedDial>
  )
}

SingleActions.propTypes = {
  onRetrieve: PropTypes.func.isRequired,
  onSignOut: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onAddPhoto: PropTypes.func.isRequired,
}

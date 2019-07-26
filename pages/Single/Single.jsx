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
  DialogContentText,
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
import querystring from 'query-string'

import {
  LoadingHeader,
  LoadingScreen,
  RootPaper,
  InstrumentDisplay,
  InstrumentForm,
  SchemaForm
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
      body: {},
      photo: null,
      photoFormOpen: false,
      error: null,
      initialLoad: true,
      editing: false,
      confirmDelete: false,
      isLoading: false,
    }
  }

  async componentDidMount() {
    await this.getInstrument()
    const query = querystring.parse(this.props.location.search)
    if (query.edit === 'true') {
      this.setState({ editing: true })
    }
  }

  getInstrument = async () => {
    this.setState({ isLoading: true })
    const { recId } = this.props.match.params
    try {
      const body = await API.get('instrument-inventory', `instruments/${recId}`)
      this.setState({
        body,
        isLoading: false,
        initialLoad: false,
      })
    } catch (e) {
      console.error(e)
    }
  }

  handleSubmit = async body => {
    this.setState({ isLoading: true })
    try {
      const response = await API.put(
        'instrument-inventory',
        `instruments/${this.props.match.params.recId}`,
        {
          body,
        }
      )
      this.setState({ editing: false })
      await this.getInstrument()
    } catch (err) {
      console.error(err)
      if (err.response.data.errors) {
        this.setState({ error: new Error(err.response.data.errors) })
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

  handlePhoto = event => {
    this.setState({ isLoading: true })
    processImage(event.target.files[0], this.setPhoto)
  }

  setPhoto = photo => {
    this.setState({ photo, isLoading: false })
  }

  uploadPhoto = async e => {
    e.preventDefault()

    if (!this.state.photo) {
      this.props.showAlert('Photo is required')
      return
    }

    if (this.state.photo.size > 5000000) {
      this.props.showAlert('Photo is too large')
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
    const { body } = this.state
    const actions = {
      onRetrieve: () => {
        this.props.history.push(`/retrieve-single/${body.number}`)
      },
      onSignOut: () => {
        this.props.history.push(`/sign-out/${body.number}`)
      },
      onEdit: () => {
        this.setState({ editing: true })
      },
      onAddPhoto: () => {
        this.setState({ photoFormOpen: true })
      },
      onDelete: () => {
        this.setState({ confirmDelete: true })
      },
    }

    const { classes, schema, showAlert, history } = this.props
    const {
      actionsOpen,
      initialLoad,
      editing,
      photoFormOpen,
      error,
      isLoading,
      confirmDelete,
    } = this.state
    return (
      <React.Fragment>
        {initialLoad || !schema ? (
          <LoadingScreen />
        ) : (
          <React.Fragment>
            <RootPaper>
              {editing ? (
                <React.Fragment>
                  <LoadingHeader isLoading={isLoading} title="Edit Instrument" />
                  <SchemaForm
                    schema={schema.components.schemas.Instrument}
                    onSubmit={this.handleSubmit}
                    error={error}
                    initialData={body}
                    onCancel={this.cancelEdit}
                  />
                </React.Fragment>
              ) : (
                <InstrumentDisplay
                  schema={schema.components.schemas.InstrumentOut}
                  body={body}
                  isLoading={isLoading && !photoFormOpen}
                />
              )}
            </RootPaper>
          </React.Fragment>
        )}
        <SingleActions {...actions} />
        <Dialog open={photoFormOpen}>
          <DialogTitle>
            <LoadingHeader
              title="Add/Change Instrument Photo"
              isLoading={isLoading && photoFormOpen}
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
              <FormControl fullWidth>
                <label htmlFor="upload-photo">
                  <Button variant="contained" component="span" color="primary">
                    Choose Photo
                  </Button>
                </label>
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
        <DeleteDialog
          itemId={this.props.match.params.recId}
          open={confirmDelete}
          instrumentType={body.type}
          instrumentNumber={body.number}
          setOpen={confirmDelete => this.setState({ confirmDelete })}
          showAlert={showAlert}
          history={history}
        />
      </React.Fragment>
    )
  }
}

Single.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
  schema: PropTypes.object,
}

export default withStyles(styles)(Single)

const singleActionsStyles = makeStyles(theme => ({
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}))

const SingleActions = ({ onRetrieve, onSignOut, onEdit, onAddPhoto, onDelete }) => {
  const [isOpen, setOpen] = useState(false)
  const classes = singleActionsStyles()
  const open = () => setOpen(true)
  const close = () => setOpen(false)
  const toggle = () => setOpen(isOpen => !isOpen)

  return (
    <SpeedDial
      ariaLabel="actions"
      icon={<SpeedDialIcon />}
      onBlur={close}
      onClick={toggle}
      onClose={close}
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
        icon={<DeleteIcon />}
        tooltipTitle="Delete"
        onClick={onDelete}
        tooltipOpen={isOpen}
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

const DeleteDialog = ({
  open,
  instrumentNumber,
  itemId,
  instrumentType,
  setOpen,
  showAlert,
  history,
}) => {
  const deleteItem = async () => {
    try {
      await API.del('instrument-inventory', `instruments/${itemId}`)
      history.push('/search')
    } catch (err) {
      showAlert('Delete Failed')
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete {instrumentType} {instrumentNumber}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button color="primary" onClick={deleteItem}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  instrumentNumber: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  instrumentType: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

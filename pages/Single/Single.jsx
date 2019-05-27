import React, { Component } from 'react'
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
  DialogActions
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

import { root } from '../../globalStyles'
import LoadingHeader from '../../components/LoadingHeader'
import { s3Upload } from '../../libs/awsLib'
import LoadingScreen from '../../components/LoadingScreen'

const styles = theme => ({
  root,
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3)
  },
  thumbnail: {
    marginLeft: 'auto',
    cursor: 'pointer'
  },
  photoPaper: {
    position: 'absolute',
    width: '80vw',
    left: '10vw',
    top: '5vh',
    padding: '2.5vh'
  },
  fullImage: {
    width: '75vw'
  },
  fileInput: {
    display: 'none'
  }
})

function titleCase(text) {
  if (text) {
    return text[0].toUpperCase() + text.slice(1, text.length)
  }
  return ''
}

function stars(count) {
  return '★'.repeat(count)
}

function rand() {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const yesOrNo = value => (value ? 'Yes' : 'No')

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
      actionsOpen: false,
      viewPhoto: false,
      newPhoto: null,
      photoFormOpen: false,
      errors: {},
      initialLoad: true
    }
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const { recId } = this.props.match.params
    try {
      const record = await API.get('instrument-inventory', `get/${recId}`)
      const { fields } = record
      this.setState({
        instrumentType: fields['Instrument Type'],
        number: fields.Number,
        size: fields.Size,
        location: fields.Location,
        assignedTo: fields['Assigned To'],
        condition: fields.Condition,
        quality: fields.Quality,
        conditionNotes: fields['Condition Notes'],
        maintenanceNotes: fields['Maintenance Notes'],
        rosin: fields.Rosin,
        bow: fields.Bow,
        readyToGo: fields['Ready To Go'],
        shoulderRestEndpinRest: fields['Shoulder Rest/Endpin Rest'],
        giftedToStudent: fields['Gifted to student'],
        isLoading: false,
        initialLoad: false
      })
      console.log(fields['Photo'])
      if (fields.Photo) {
        this.setState({
          thumbnailUrl: fields.Photo[0].thumbnails.small.url,
          fullPhotoUrl: fields.Photo[0].url
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  handleChange = field => event => {
    this.setState({ [field]: event.target.value })
  }

  openActions = () => this.setState({ actionsOpen: true })

  closeActions = () => this.setState({ actionsOpen: false })

  toggleActions = () => this.setState({ actionsOpen: !this.state.actionsOpen })

  onRetrieve = () => {
    const { number } = this.state
    this.props.history.push(`/retrieve-single/${number}`)
  }

  onSignOut = () => {
    const { number } = this.state
    this.props.history.push(`/sign-out/${number}`)
  }

  onEdit = () => {
    alert('Not implemented yet')
  }

  showPhoto = () => {
    this.setState({ viewPhoto: true })
  }

  handlePhoto = event => {
    this.setState({ newPhoto: event.target.files[0] })
  }

  uploadPhoto = async e => {
    e.preventDefault()

    if (!this.state.newPhoto) {
      this.setState({ errors: { photo: 'Photo is required' } })
      return
    }

    if (this.state.newPhoto.size > 5000000) {
      this.setState({ errors: { photo: 'Photo is too large. Choose Photo under 5MB' } })
      return
    }

    try {
      const uploadedPhoto = await s3Upload(this.state.newPhoto)
      const photoUrl = await Storage.vault.get(uploadedPhoto)

      const response = await API.patch(
        'instrument-inventory',
        `update/photo/${this.props.match.params.recId}`,
        { body: { photoUrl } }
      )
      this.setState({ newPhoto: null, photoFormOpen: false })
    } catch (err) {
      console.error(err)
      if (err.response.data.errors) {
        this.setState({ errors: err.response.data.errors })
      }
    }
  }

  render() {
    const { classes } = this.props
    const {
      number,
      instrumentType,
      size,
      photoUrl,
      location,
      assignedTo,
      condition,
      quality,
      conditionNotes,
      maintenanceNotes,
      rosin,
      bow,
      readyToGo,
      shoulderRestEndpinRest,
      giftedToStudent,
      actionsOpen,
      thumbnailUrl,
      viewPhoto,
      fullPhotoUrl,
      initialLoad
    } = this.state
    return (
      <React.Fragment>
        {initialLoad ? (
          <LoadingScreen />
        ) : (
          <React.Fragment>
            <Paper className={classes.root}>
              <Grid container direction="row">
                <Grid item>
                  <LoadingHeader
                    isLoading={this.state.isLoading}
                    title={`${titleCase(instrumentType)} ${number}`}
                  />
                </Grid>
                {thumbnailUrl && (
                  <Grid item className={classes.thumbnail} onClick={this.showPhoto}>
                    <img src={thumbnailUrl} width="50px" height="50px" />
                  </Grid>
                )}
              </Grid>
              <List disablePadding component="ul">
                <InfoItem primary="Size" secondary={size} />
                <InfoItem primary="Location" secondary={location} />
                <InfoItem primary="Assigned To" secondary={assignedTo} />
                <InfoItem primary="Condition" secondary={stars(condition)} />
                <InfoItem primary="Quality" secondary={stars(quality)} />
                <InfoItem primary="Condition Notes" secondary={conditionNotes} />
                <InfoItem primary="Maintenance Notes" secondary={maintenanceNotes} />
                <InfoItem primary="Rosin" secondary={yesOrNo(rosin)} />
                <InfoItem primary="Bow" secondary={yesOrNo(bow)} />
                <InfoItem primary="Ready To Go" secondary={yesOrNo(readyToGo)} />
                <InfoItem
                  primary="Should Rest/Rock Stop"
                  secondary={yesOrNo(shoulderRestEndpinRest)}
                />
                <InfoItem
                  primary="Gifted to Student"
                  secondary={yesOrNo(giftedToStudent)}
                />
              </List>
            </Paper>
            <SpeedDial
              ariaLabel="actions"
              icon={<SpeedDialIcon />}
              onBlur={this.closeActions}
              onClick={this.toggleActions}
              onClose={this.closeActions}
              onFocus={this.openActions}
              onMouseEnter={this.openActions}
              onMouseLeave={this.closeActions}
              open={actionsOpen}
              direction="up"
              className={classes.speedDial}
            >
              <SpeedDialAction
                icon={<InputIcon />}
                tooltipTitle="Retrieve"
                tooltipOpen={actionsOpen}
                onClick={this.onRetrieve}
              />
              <SpeedDialAction
                icon={<LabelIcon />}
                tooltipTitle="Sign Out"
                tooltipOpen={actionsOpen}
                onClick={this.onSignOut}
              />
              <SpeedDialAction
                icon={<EditIcon />}
                tooltipTitle="Edit"
                tooltipOpen={actionsOpen}
                onClick={this.onEdit}
              />
              <SpeedDialAction
                icon={<CameraIcon />}
                tooltipTitle="Add Photo"
                tooltipOpen={actionsOpen}
                onClick={() => this.setState({ photoFormOpen: true })}
              />
            </SpeedDial>
            <Modal open={viewPhoto} onClose={() => this.setState({ viewPhoto: false })}>
              <Paper className={classes.photoPaper}>
                <img src={fullPhotoUrl} className={classes.fullImage} />
              </Paper>
            </Modal>
            <Dialog open={this.state.photoFormOpen}>
              <DialogContent>
                <form onSubmit={this.uploadPhoto}>
                  <input
                    accept="image/*"
                    id="upload-photo"
                    type="file"
                    className={classes.fileInput}
                    onChange={this.handlePhoto}
                  />
                  <FormControl fullWidth error={this.state.errors.photo ? true : false}>
                    <label htmlFor="upload-photo">
                      <Button variant="contained" component="span" color="primary">
                        Choose Photo
                      </Button>
                    </label>
                    {this.state.errors.photo && (
                      <FormHelperText id="photo-error">
                        {this.state.errors.photo}
                      </FormHelperText>
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
                  disabled={this.state.newPhoto ? false : true}
                  onClick={this.uploadPhoto}
                >
                  Upload
                </Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}

Single.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
}

export default withStyles(styles)(Single)

const InfoItem = ({ primary, secondary }) => (
  <ListItem component="li">
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{ variant: 'subtitle1', color: 'textSecondary' }}
      secondaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
    />
  </ListItem>
)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Paper,
  withStyles,
  FormControl,
  Input,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import SpeedDial from '@material-ui/lab/SpeedDial'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import InputIcon from '@material-ui/icons/Input'
import LabelIcon from '@material-ui/icons/Label'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { API } from 'aws-amplify'

import { root } from '../../globalStyles'
import LoadingHeader from '../../components/LoadingHeader'

const styles = theme => ({
  root,
  speedDial: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(3)
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

const yesOrNo = value => (value ? 'Yes' : 'No')

class Single extends Component {
  constructor(props) {
    super(props)

    this.state = {
      number: '',
      photoUrl: 'https://unsplash.com/photos/wPaBwop_rSo/download',
      instrumentType: '',
      size: '',
      location: '',
      assignedTo: '',
      condition: null,
      quality: null,
      conditionNotes:
        'condition notes. this could be rather long and I want to see how it handles it. Will it be any good? What if it were even longer, bordering on two lines',
      maintenanceNotes: 'maintenance',
      rosin: true,
      bow: true,
      readyToGo: true,
      shoulderRestEndpinRest: true,
      giftedToStudent: true,
      isLoading: false,
      actionsOpen: false
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
        isLoading: false
      })
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
      actionsOpen
    } = this.state
    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <LoadingHeader
            isLoading={this.state.isLoading}
            title={`${titleCase(instrumentType)} ${number}`}
          />
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
        </SpeedDial>
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

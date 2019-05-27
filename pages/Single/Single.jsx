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
// import SpeedDial from '@material-ui/lab/SpeedDial'
// import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
// import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import { root } from '../../globalStyles'
import LoadingHeader from '../../components/LoadingHeader'

const styles = {
  root
}

function titleCase(text) {
  return text[0].toUpperCase() + text.slice(1, text.length)
}

function stars(count) {
  return '★'.repeat(count)
}

const yesOrNo = value => (value ? 'Yes' : 'No')

class Single extends Component {
  constructor(props) {
    super(props)

    this.state = {
      number: '1-601',
      photoUrl: 'https://unsplash.com/photos/wPaBwop_rSo/download',
      instrumentType: 'violin',
      size: '4/4',
      location: 'Grant Elementary School',
      assignedTo: 'Test Name',
      condition: 5,
      quality: 3,
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

  handleSubmit = () => {}

  handleChange = field => event => {
    this.setState({ [field]: event.target.value })
  }

  openActions = () => this.setState({ actionsOpen: true })

  closeActions = () => this.setState({ actionsOpen: false })

  toggleActions = () => this.setState({ actionsOpen: !this.state.actionsOpen })

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
          {/* <SpeedDial
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
          >
            <SpeedDialAction />
          </SpeedDial> */}
        </Paper>
      </React.Fragment>
    )
  }
}

Single.propTypes = {
  classes: PropTypes.object.isRequired
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

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  makeStyles,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
} from '@material-ui/core'
import ExifOrientationImg from 'react-exif-orientation-img'
import { LoadingHeader } from '..'
import { titleCase } from '../../libs/titleCase'
import { stars, yesOrNo } from '../../libs/display'

const useStyles = makeStyles({
  thumbnail: {
    marginLeft: 'auto',
    cursor: 'pointer',
  },
  fullImage: {
    position: 'absolute',
    left: '15vw',
    top: '10vh',
    width: '75vw',
    imageOrientation: 'from-image',
    border: 'none',
  },
})

const InstrumentDisplay = ({
  isLoading,
  instrumentType,
  instrumentNumber,
  size,
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
  instrumentHistory,
  thumbnailUrl = '',
  fullPhotoUrl = '',
}) => {
  const [photoOpen, showPhoto] = useState(false)
  const classes = useStyles()
  if (instrumentHistory) {
    instrumentHistory = instrumentHistory.join(', ')
  }

  return (
    <React.Fragment>
      <Grid container direction="row">
        <Grid item>
          <LoadingHeader
            isLoading={isLoading}
            title={`${titleCase(instrumentType)} ${instrumentNumber}`}
          />
        </Grid>
        {thumbnailUrl && (
          <Grid item className={classes.thumbnail} onClick={() => showPhoto(true)}>
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
        <InfoItem primary="History" secondary={instrumentHistory} />
        <InfoItem primary="Rosin" secondary={yesOrNo(rosin)} />
        <InfoItem primary="Bow" secondary={yesOrNo(bow)} />
        <InfoItem primary="Ready To Go" secondary={yesOrNo(readyToGo)} />
        <InfoItem
          primary="Should Rest/Rock Stop"
          secondary={yesOrNo(shoulderRestEndpinRest)}
        />
        <InfoItem primary="Gifted to Student" secondary={yesOrNo(giftedToStudent)} />
      </List>
      <Modal open={photoOpen} onClose={() => showPhoto(false)}>
        <ExifOrientationImg
          src={fullPhotoUrl}
          className={classes.fullImage}
          alt="instrument image"
        />
      </Modal>
    </React.Fragment>
  )
}

InstrumentDisplay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  instrumentType: PropTypes.string.isRequired,
  instrumentNumber: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  assignedTo: PropTypes.string,
  condition: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  quality: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  conditionNotes: PropTypes.string,
  maintenanceNotes: PropTypes.string,
  rosin: PropTypes.bool,
  bow: PropTypes.bool,
  readyToGo: PropTypes.bool,
  shoulderRestEndpinRest: PropTypes.bool,
  giftedToStudent: PropTypes.bool,
  instrumentHistory: PropTypes.string,
  thumbnailUrl: PropTypes.string,
  fullPhotoUrl: PropTypes.string,
}

export default InstrumentDisplay

export const InfoItem = ({ primary, secondary }) => (
  <ListItem component="li">
    <ListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{ variant: 'subtitle1', color: 'textSecondary' }}
      secondaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
    />
  </ListItem>
)

InfoItem.propTypes = {
  primary: PropTypes.string.isRequired,
  secondary: PropTypes.string,
}

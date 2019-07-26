import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Modal,
} from '@material-ui/core'
import ExifOrientationImg from 'react-exif-orientation-img'

import { LoadingHeader } from '..'
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

const InstrumentDisplay = ({ isLoading, schema, body, omitFields = [] }) => {
  const [showPhoto, setShowPhoto] = useState(false)
  const classes = useStyles()
  return (
    <React.Fragment>
      <Grid container direction="row">
        <LoadingHeader isLoading={isLoading} title={`${body.type} ${body.number}`} />
        {body.photoUrls && (
          <Grid item className={classes.thumbnail} onClick={() => setShowPhoto(true)}>
            <img src={body.photoUrls.thumbnail} width="50px" height="50px" />
          </Grid>
        )}
      </Grid>
      <List disablePadding component="ul">
        <InstrumentDisplayFields
          schema={schema}
          body={body}
          omitFields={[...omitFields, 'id', 'type', 'number', 'photoUrls']}
        />
      </List>
      {body.photoUrls && (
        <Modal open={showPhoto} onClose={() => setShowPhoto(false)}>
          <ExifOrientationImg
            src={body.photoUrls.full}
            className={classes.fullImage}
            alt="instrument photo"
          />
        </Modal>
      )}
    </React.Fragment>
  )
}

InstrumentDisplay.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  schema: PropTypes.object,
  body: PropTypes.object,
  omitFields: PropTypes.array,
}

const InstrumentDisplayFields = ({ schema, body, omitFields }) => (
  <List disablePadding component="ul">
    {Object.keys(schema.properties)
      .filter(field => (omitFields.includes(field) ? null : field))
      .map(field => (
        <InfoItem
          title={schema.properties[field].title}
          data={body[field]}
          type={schema.properties[field].type}
          key={field}
        />
      ))}
  </List>
)

InstrumentDisplayFields.propTypes = {
  schema: PropTypes.object,
  body: PropTypes.object,
  omitFields: PropTypes.array,
}

const InfoItem = ({ title, data, type }) => {
  let text
  switch (type) {
    case 'array':
      text = data ? data.join(', ') : ''
      break
    case 'integer':
      text = stars(data)
      break
    case 'boolean':
      text = yesOrNo(data)
      break
    default:
      text = data
  }

  return (
    <ListItem component="li">
      <ListItemText
        primary={title}
        secondary={text}
        primaryTypographyProps={{ variant: 'subtitle1', color: 'textSecondary' }}
        secondaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
      />
    </ListItem>
  )
}

InfoItem.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.any,
  type: PropTypes.string.isRequired,
}

export default InstrumentDisplay

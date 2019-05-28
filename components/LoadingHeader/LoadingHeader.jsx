import React from 'react'
import PropTypes from 'prop-types'

import { withStyles, CircularProgress, Typography } from '@material-ui/core'

const styles = {
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  loader: {
    marginLeft: '1rem',
  },
}

const LoadingHeader = ({ classes, isLoading, title }) => {
  return (
    <div className={classes.heading}>
      <Typography variant="h5" color="inherit">
        {title}
      </Typography>
      {isLoading && <CircularProgress className={classes.loader} />}
    </div>
  )
}

LoadingHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default withStyles(styles)(LoadingHeader)

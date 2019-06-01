import React from 'react'
import PropTypes from 'prop-types'

import { makeStyles, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles({
  heading: {
    display: 'flex',
    flexDirection: 'row',
  },
  loader: {
    marginLeft: '1rem',
  },
})

const LoadingHeader = ({ isLoading, title }) => {
  const classes = useStyles()
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
  isLoading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
}

export default LoadingHeader

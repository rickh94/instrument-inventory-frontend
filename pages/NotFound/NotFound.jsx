import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'

import RootPaper from '../../components/RootPaper/RootPaper';


const NotFound = () => {
  return (
    <RootPaper>
      <Typography variant="h5">Not Found</Typography>
      <Typography varaint="body1">
        Could not find the page you were looking for
      </Typography>
    </RootPaper>
  )
}

NotFound.propTypes = {}

export default NotFound

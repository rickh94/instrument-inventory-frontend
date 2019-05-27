import React from 'react'
import { Typography } from '@material-ui/core'

import { RootPaper } from '../../components'

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


export default NotFound

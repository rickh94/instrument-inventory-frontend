import React from 'react'
import PropTypes from 'prop-types'
import { Paper, withStyles } from '@material-ui/core'
import { BulletList as LoadingList } from 'react-content-loader'

import {root} from '../../globalStyles'

const styles = {root}

const LoadingScreen = ({classes}) => {
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <LoadingList />
      </Paper>
    </React.Fragment>
  )
}

LoadingScreen.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(LoadingScreen)

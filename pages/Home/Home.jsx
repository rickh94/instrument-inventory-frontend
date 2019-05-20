import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  List,
  ListItem,
  withStyles,
  Paper,
  Link,
  ListItemIcon,
  ListItemText
} from '@material-ui/core'
import ArchiveIcon from '@material-ui/icons/Archive'
import ListIcon from '@material-ui/icons/FormatListBulleted'
import purple from '@material-ui/core/colors/purple'

const styles = theme => ({
  root: {
    maxWidth: 500,
    padding: '1rem',
    margin: '1rem auto'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: purple[50],
    color: purple[300]
  }
})

function Home(props) {
  const { classes } = props
  return (
    <React.Fragment>
      <Paper className={classes.root}>
        <Typography variant="h4" color="inherit">
          Functions
        </Typography>
        <List>
          <ListItem button onClick={() => props.history.push('/retrieve-single')}>
            <ListItemIcon>
              <ArchiveIcon />
            </ListItemIcon>
            <ListItemText>Retrieve An Instrument</ListItemText>
          </ListItem>
          <ListItem button onClick={() => props.history.push('/retrieve-multiple')}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText>Retrieve Multiple Instruments</ListItemText>
          </ListItem>
        </List>
      </Paper>
      <div className={classes.footer}>
        <Typography variant="body2" color="inherit">
          &copy; Rick Henry 2019
        </Typography>
        <Link target="_blank" href="http://chittagongit.com/icon/violin-icon-27.html">
          <Typography variant="body2" color="inherit">
            Icon Credit
          </Typography>
        </Link>
      </div>
    </React.Fragment>
  )
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)

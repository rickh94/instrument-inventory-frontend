import React from 'react'
import { Typography, List, ListItem, withStyles, Paper, Link } from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'

const styles = theme => ({
  root: {
    width: '100%',
    padding: '0.5rem'
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
      <div className={classes.root}>
        <Typography variant="h3" color="inherit">
          Functions
        </Typography>
        <List>
          <ListItem button>Retrieve An Instrument</ListItem>
          <ListItem button>Retrieve Multiple Instruments</ListItem>
        </List>
      </div>
      <div className={classes.footer}>
        <Typography variant="body2" color="inherit">
          &copy; Rick Henry 2019
        </Typography>
        <Link target="_blank" href="http://chittagongit.com/icon/violin-icon-27.html">
          <Typography variant="body2" color="inherit">Icon Credit</Typography>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default withStyles(styles)(Home)

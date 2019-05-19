import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Link as RouterLink } from 'react-router-dom'

import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import {
  IconButton,
  Toolbar,
  AppBar,
  Typography,
  Button,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon
} from '@material-ui/core'

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  barText: {
    color: 'white'
  },
  cleanLink: {
    textDecoration: 'none',
    color: 'inherit'
  }
}

export function Nav(props) {
  const { classes } = props
  const [drawerIsOpen, setDrawerOpen] = useState(false)
  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="Menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              Instrument Inventory
            </Typography>
            {props.isAuthenticated ? (
              <Button color="inherit" onClick={props.handleLogout} id="#logout">
                Logout
              </Button>
            ) : (
              <RouterLink to="/login">
                <Button color="inherit" className={classes.barText}>
                  Login
                </Button>
              </RouterLink>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <SwipeableDrawer
        open={drawerIsOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(false)}
      >
        <List>
          <ListItem button>
            <ListItemText>
              <RouterLink to="/" className={classes.cleanLink}>Home</RouterLink>
            </ListItemText>
          </ListItem>
          <Divider></Divider>
          <ListItem button>
          <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText>
              <RouterLink to="/profile" className={classes.cleanLink}>Profile</RouterLink>
            </ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
    </React.Fragment>
  )
}

Nav.propTypes = {
  classes: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired
}

export default withStyles(styles)(Nav)

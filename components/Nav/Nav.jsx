import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import HomeIcon from '@material-ui/icons/Home'
import ListIcon from '@material-ui/icons/FormatListBulleted'
import InputIcon from '@material-ui/icons/Input'

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
        <AppBar position="fixed">
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
              <RouterLink to="/login" className={classes.cleanLink}>
                <Button color="inherit" className={classes.barText}>
                  Login
                </Button>
              </RouterLink>
            )}
          </Toolbar>
        </AppBar>
      </div>
      <Toolbar />
      <SwipeableDrawer
        open={drawerIsOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
      >
        <List>
          <NavItem
            to="/"
            icon={<HomeIcon />}
            text="Home"
            setDrawerOpen={setDrawerOpen}
          />
          <NavItem
            to="/retrieve-single"
            text="Retrieve Instrument"
            icon={<InputIcon />}
            setDrawerOpen={setDrawerOpen}
          />
          <NavItem
            to="/retrieve-multiple"
            text="Retrieve Multiple Instruments"
            icon={<ListIcon />}
            setDrawerOpen={setDrawerOpen}
          />
          <Divider />
          <NavItem
            to="/profile"
            icon={<PersonIcon />}
            text="Profile"
            setDrawerOpen={setDrawerOpen}
          />
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

const NavItem = withRouter(({ to, icon, history, setDrawerOpen, text }) => {
  return (
    <ListItem
      button
      onClick={() => {
        setDrawerOpen(false)
        history.push(to)
      }}
    >
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText>{text}</ListItemText>
    </ListItem>
  )
})

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  icon: PropTypes.object,
  text: PropTypes.string.isRequired
}

export default withStyles(styles)(withRouter(Nav))

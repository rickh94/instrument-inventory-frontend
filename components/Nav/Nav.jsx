import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import HomeIcon from '@material-ui/icons/Home'
import ArchiveIcon from '@material-ui/icons/Archive'
import ListIcon from '@material-ui/icons/FormatListBulleted'
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
  const navRequiredProps = { setDrawerOpen, history: props.history }
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
              <RouterLink to="/login" className={classes.cleanLink}>
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
        onOpen={() => setDrawerOpen(true)}
      >
        <List>
          <NavItem to="/" icon={<HomeIcon />} text="Home" {...navRequiredProps} />
          <NavItem
            to="/retrieve-single"
            text="Retrieve Instrument"
            icon={<ArchiveIcon />}
            {...navRequiredProps}
          />
          <NavItem
            to="/retrieve-multiple"
            text="Retrieve Multiple Instruments"
            icon={<ListIcon />}
            {...navRequiredProps}
          />
          <Divider />
          <NavItem
            to="/profile"
            icon={<PersonIcon />}
            text="Profile"
            {...navRequiredProps}
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

function NavItem(props) {
  return (
    <ListItem
      button
      onClick={() => {
        props.setDrawerOpen(false)
        props.history.push(props.to)
      }}
    >
      {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
      <ListItemText>{props.text}</ListItemText>
    </ListItem>
  )
}

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  icon: PropTypes.object,
  text: PropTypes.string.isRequired
}

export default withStyles(styles)(withRouter(Nav))

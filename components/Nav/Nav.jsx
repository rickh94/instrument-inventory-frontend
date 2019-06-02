import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Link as RouterLink, withRouter } from 'react-router-dom'

import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import HomeIcon from '@material-ui/icons/Home'
import ListIcon from '@material-ui/icons/FormatListBulleted'
import InputIcon from '@material-ui/icons/Input'
import LabelIcon from '@material-ui/icons/Label'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import FilterIcon from '@material-ui/icons/FilterList'

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
  ListItemIcon,
} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  barText: {
    color: 'white',
  },
  cleanLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
})

export function Nav(props) {
  const classes = useStyles()
  const [drawerIsOpen, setDrawerOpen] = useState(false)

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" aria-label="Menu" onClick={openDrawer}>
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
      <SwipeableDrawer open={drawerIsOpen} onClose={closeDrawer} onOpen={openDrawer}>
        <List component="ul">
          <NavItem
            to="/"
            icon={<HomeIcon />}
            text="Home"
            setDrawerOpen={setDrawerOpen}
          />
          <NavItem
            to="/create"
            text="Create New Instrument"
            icon={<AddIcon />}
            setDrawerOpen={setDrawerOpen}
          />
          <NavItem
            to="/sign-out"
            text="Sign Out instrument"
            icon={<LabelIcon />}
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
          <NavItem
            to="/search"
            text="Find an Instrument"
            icon={<SearchIcon />}
            setDrawerOpen={setDrawerOpen}
          />
          <NavItem
            to="/filter"
            text="Filter Instruments"
            icon={<FilterIcon />}
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
  isAuthenticated: PropTypes.bool.isRequired,
  handleLogout: PropTypes.func.isRequired,
}

export const NavItemInternal = ({ to, icon, history, setDrawerOpen, text }) => (
  <ListItem
    button
    onClick={() => {
      setDrawerOpen(false)
      history.push(to)
    }}
    data-testid="item"
    component="li"
  >
    {icon && <ListItemIcon>{icon}</ListItemIcon>}
    <ListItemText>{text}</ListItemText>
  </ListItem>
)


NavItemInternal.propTypes = {
  to: PropTypes.string.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  icon: PropTypes.element,
  text: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
}

const NavItem = withRouter(NavItemInternal)
export default withRouter(Nav)

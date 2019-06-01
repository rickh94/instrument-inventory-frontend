import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  List,
  ListItem,
  withStyles,
  Link,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import InputIcon from '@material-ui/icons/Input'
import ListIcon from '@material-ui/icons/FormatListBulleted'
import LabelIcon from '@material-ui/icons/Label'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import FilterIcon from '@material-ui/icons/FilterList'
import { withRouter } from 'react-router-dom'

import { RootPaper, FindInstrument, TodoList } from '../../components'

const styles = {
  footer: {
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  footerItem: {
    marginLeft: '0.2rem',
  },
}

function Home(props) {
  const { classes } = props
  const showMultipleResults = results => {
    props.setSearchResults(results)
    props.history.push('/search')
  }

  return (
    <React.Fragment>
      <RootPaper>
        <FindInstrument
          showMultipleResults={showMultipleResults}
          showAlert={props.showAlert}
        />
      </RootPaper>
      <RootPaper>
        <TodoList />
        {/* <List>
          <ListOptionItem
            to="/create"
            icon={<AddIcon />}
            text="Create a New Instrument"
          />
          <ListOptionItem
            to="/sign-out"
            icon={<LabelIcon />}
            text="Sign out instrument"
          />
          <ListOptionItem
            to="/retrieve-single"
            icon={<InputIcon />}
            text="Retrieve An Instrument"
          />
          <ListOptionItem
            to="/retrieve-multiple"
            icon={<ListIcon />}
            text="Retrieve Multiple Instruments"
          />
          <ListOptionItem
            to="/search"
            icon={<SearchIcon />}
            text="Find an Instrument"
          />
          <ListOptionItem
            to="/filter"
            icon={<FilterIcon />}
            text="Filter Instruments"
          />
        </List> */}
      </RootPaper>
      <div className={classes.footer}>
        <Typography variant="body2" color="inherit" className={classes.footerItem}>
          &copy; Rick Henry 2019 |{' '}
        </Typography>
        <Link
          target="_blank"
          href="http://chittagongit.com/icon/violin-icon-27.html"
          rel="noopener"
        >
          <Typography variant="body2" color="inherit" className={classes.footerItem}>
            {' '}
            Icon Credit
          </Typography>
        </Link>
      </div>
    </React.Fragment>
  )
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
  setSearchResults: PropTypes.func.isRequired,
}

export default withStyles(styles)(Home)

const ListOptionItem = withRouter(({ to, icon, text, history }) => {
  return (
    <ListItem button onClick={() => history.push(to)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItem>
  )
})

ListOptionItem.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  text: PropTypes.string.isRequired,
}

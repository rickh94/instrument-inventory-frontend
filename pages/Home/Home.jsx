import React from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  ListItem,
  withStyles,
  Link,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
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

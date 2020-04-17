import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import {
  Typography,
  ListItem,
  Link,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

import { RootPaper, FindInstrument, TodoList } from '../components'
import { HelpersContext } from '../contexts'

const useStyles = makeStyles({
  footer: {
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
})

function Home(props) {
  const classes = useStyles()
  const { setSearchResults } = useContext(HelpersContext)

  const showMultipleResults = results => {
    setSearchResults(results)
    props.history.push('/search')
  }

  return (
    <React.Fragment>
      <RootPaper>
        <FindInstrument showMultipleResults={showMultipleResults} />
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
  history: PropTypes.object.isRequired,
}

export default Home
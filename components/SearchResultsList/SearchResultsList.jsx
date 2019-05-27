import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { List, ListItem, ListItemText } from '@material-ui/core'
import { titleCase } from '../../libs/titleCase'

const ResultItem = withRouter(({ item, history }) => (
  <ListItem button onClick={() => history.push(`/instrument/${item.id}`)}>
    <ListItemText>
      {titleCase(item.fields['Instrument Type'])} {item.fields.Number} |{' '}
      {item.fields.Size} | {item.fields['Assigned To'] || 'Not Assigned'} |{' '}
      {item.fields['Location']}
    </ListItemText>
  </ListItem>
))

ResultItem.propTypes = {
  item: PropTypes.object.isRequired
}

const SearchResultsList = ({ results }) => (
  <List>
    {results.map(item => (
      <ResultItem item={item} key={item.id} />
    ))}
  </List>
)

SearchResultsList.propTypes = {
  results: PropTypes.array.isRequired
}

export default SearchResultsList

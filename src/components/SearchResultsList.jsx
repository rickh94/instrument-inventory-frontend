import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { Table, TableRow, TableBody, TableCell, TableHead } from '@material-ui/core'
import { titleCase } from '../libs/titleCase'

export const ResultRowInternal = ({ item, history }) => (
  <TableRow
    hover
    onClick={() => history.push(`/instrument/${item.id}`)}
    component="tr"
    data-testid="result-row"
  >
    <TableCell component="td" data-testid="type-and-number">
      {titleCase(item.type)} {item.number}
    </TableCell>
    <TableCell component="td" data-testid="size">
      {item.size}
    </TableCell>
    <TableCell component="td" data-testid="assignedTo">
      {item.assignedTo || 'Not Assigned'}
    </TableCell>
    <TableCell component="td" data-testid="location">
      {item.location}
    </TableCell>
  </TableRow>
)

ResultRowInternal.propTypes = {
  item: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const ResultRow = withRouter(ResultRowInternal)

const SearchResultsList = ({ results }) => (
  <Table component="table">
    <TableHead component="thead">
      <TableRow component="tr">
        <TableCell component="th">Instrument</TableCell>
        <TableCell component="th">Size</TableCell>
        <TableCell component="th">Assigned To</TableCell>
        <TableCell component="th">Location</TableCell>
      </TableRow>
    </TableHead>
    <TableBody component="tbody">
      {results.map(item => (
        <ResultRow item={item} key={item.id} />
      ))}
    </TableBody>
  </Table>
)

SearchResultsList.propTypes = {
  results: PropTypes.array.isRequired,
}

export default SearchResultsList

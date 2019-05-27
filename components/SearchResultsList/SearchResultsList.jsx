import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { Table, TableRow, TableBody, TableCell, TableHead } from '@material-ui/core'
import { titleCase } from '../../libs/titleCase'

const ResultRow = withRouter(({ item, history }) => (
  <TableRow hover onClick={() => history.push(`/instrument/${item.id}`)} component="tr">
    <TableCell component="td">
      {titleCase(item.fields['Instrument Type'])} {item.fields.Number}
    </TableCell>
    <TableCell component="td">{item.fields.Size}</TableCell>
    <TableCell component="td">{item.fields['Assigned To'] || 'Not Assigned'}</TableCell>
    <TableCell component="td">{item.fields['Location']}</TableCell>
  </TableRow>
))

ResultRow.propTypes = {
  item: PropTypes.object.isRequired
}

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
  results: PropTypes.array.isRequired
}

export default SearchResultsList

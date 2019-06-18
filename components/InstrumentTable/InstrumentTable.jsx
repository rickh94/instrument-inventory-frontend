import React, { useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles,
} from '@material-ui/core'
import InstrumentRow from '../InstrumentRow/InstrumentRow'
import DownIcon from '@material-ui/icons/ArrowDropDown'
import UpIcon from '@material-ui/icons/ArrowDropUp'

const defaultColumns = [
  'Photo',
  'Number',
  'Instrument Type',
  'Size',
  'Assigned To',
  'Location',
  'Condition',
  'Quality',
  'Maintenance Notes',
  'Condition Notes',
  'Ready To Go',
  'Rosin',
  'Bow',
  'Shoulder Rest/Endpin Rest',
  'Gifted to student',
  'History',
]

const useStyles = makeStyles({
  tableHeader: {
    cursor: 'pointer',
  },
})

const compareField = (field, a, b, sortDirection) =>
  a.record.fields[field] < b.record.fields[field]
    ? -1 * sortDirection
    : 1 * sortDirection

const InstrumentTable = ({
  columns = defaultColumns,
  records,
  // sortFunctions,
}) => {
  const columnsInOrder = defaultColumns.filter(name => columns.includes(name))
  const [rows, setRows] = useState([])
  const [sortedBy, setSortedBy] = useState('')
  const [sortDirection, setSortDirection] = useState(1)
  const classes = useStyles()

  useLayoutEffect(() => {
    setRows(
      records.map(record => ({
        elem: <InstrumentRow key={record.id} record={record} columns={columns} />,
        record,
      }))
    )
  }, [records])

  const sortByField = field => () => {
    let direction = sortDirection
    if (sortedBy === field) {
      setSortDirection(sortDirection => -sortDirection)
      direction = -direction
    } else {
      setSortDirection(1)
      direction = 1
    }
    setSortedBy(field)
    setRows(rows => {
      const newRows = rows.slice(0)
      newRows.sort((a, b) => compareField(field, a, b, direction))
      return newRows
    })
  }

  const sortIcon = sortDirection == 1 ? <DownIcon /> : <UpIcon />

  return (
    <React.Fragment>
      <Table component="table">
        <TableHead component="thead">
          <TableRow component="tr">
            <TableCell component="th" />
            {columnsInOrder.map(name => (
              <TableCell
                component="th"
                key={`header-${name}`}
                onClick={sortByField(name)}
                className={classes.tableHeader}
              >
                {name}{sortedBy == name && sortIcon}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody component="tbody">
          {rows.map(row => row.elem)}
          {/* {records.map(record => (
          <InstrumentRow key={record.id} record={record} columns={columnsInOrder} />
        ))} */}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}

InstrumentTable.propTypes = {
  columns: PropTypes.array,
  records: PropTypes.array.isRequired,
}

export default InstrumentTable

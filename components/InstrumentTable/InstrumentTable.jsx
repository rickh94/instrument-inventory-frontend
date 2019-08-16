import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TableCell, Typography } from '@material-ui/core'
import {withStyles} from '@material-ui/styles'
import clsx from 'clsx'
import { AutoSizer, Column, Table } from 'react-virtualized'
import DownIcon from '@material-ui/icons/ArrowDropDown'
import UpIcon from '@material-ui/icons/ArrowDropUp'
import { stars, yesOrNo, truncateText } from '../../libs/display'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
  icon: {
    position: 'relative',
    top: 2,
    // width: theme.typography.subtitle1.fontSize,
    // height: theme.typography.subtitle1.fontSize,
    width: 18,
    height: 18,
  },
})

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  }

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    })
  }

  cellRenderer = ({ cellData, columnIndex, dataKey, ...other }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props
    if (dataKey === 'condition' || dataKey === 'quality') {
      cellData = stars(cellData)
    } else if (
      dataKey === 'ready' ||
      dataKey === 'rosin' ||
      dataKey === 'bow' ||
      dataKey === 'shoulderRestEndpinRest' ||
      dataKey === 'gifted'
    ) {
      cellData = yesOrNo(cellData)
    } else if (dataKey === 'maintenanceNotes' || dataKey === 'conditionNotes') {
      cellData = truncateText(cellData, 15)
    } else if (dataKey === 'history' && cellData) {
      cellData = truncateText(cellData.join(', '), 30)
    }
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numberic) || false
            ? 'right'
            : 'left'
        }
      >
        {cellData}
      </TableCell>
    )
  }

  headerRenderer = ({ label, columnIndex, dataKey }) => {
    const { headerHeight, columns, classes, sortByField } = this.props
    let arrowIcon = ''
    if (this.props.sortBy === dataKey) {
      arrowIcon =
        this.props.sortDirection === 'DESC' ? (
          <DownIcon className={classes.icon} />
        ) : (
          <UpIcon className={classes.icon} />
        )
    }

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: dataKey === 'history',
        })}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        onClick={sortByField(dataKey)}
      >
        <Typography variant="body2">
          {label} {arrowIcon}
        </Typography>
      </TableCell>
    )
  }

  render() {
    const { classes, columns, ...tableProps } = this.props

    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({ ...headerProps, columnIndex: index })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
  sortByField: PropTypes.func.isRequired,
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)

const defaultForField = {
  number: '',
  type: '',
  size: '',
  assignedTo: '',
  location: '',
  condition: 0,
  quality: 0,
  gifted: false,
}

const compareField = (field, a, b, sortDirection) => {
  const aValue = a[field] || defaultForField[field]
  const bValue = b[field] || defaultForField[field]
  if (aValue < bValue) {
    return -sortDirection
  }
  if (bValue < aValue) {
    return sortDirection
  }
  return 0
}

export const InstrumentTable = ({ records, history }) => {
  const [rows, setRows] = useState(records)
  const [sortedBy, setSortedBy] = useState('')
  const [sortDirection, setSortDirection] = useState(1)

  const sortByField = field => () => {
    if (field === 'history') {
      return
    }
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

  const onRowClick = ({ rowData }) => history.push(`/instrument/${rowData.id}`)

  return (
    <React.Fragment>
      <VirtualizedTable
        sortBy={sortedBy}
        sortDirection={sortDirection === 1 ? 'DESC' : 'ASC'}
        sortByField={sortByField}
        rowCount={rows.length}
        rowGetter={({ index }) => ({ ...rows[index] })}
        onRowClick={onRowClick}
        columns={[
          { width: 120, label: 'Number', dataKey: 'number' },
          { width: 140, label: 'Type', dataKey: 'type' },
          { width: 110, label: 'Size', dataKey: 'size' },
          { width: 180, label: 'Assigned To', dataKey: 'assignedTo' },
          { width: 210, label: 'Location', dataKey: 'location' },
          { width: 120, label: 'Condition', dataKey: 'condition' },
          { width: 110, label: 'Quality', dataKey: 'quality' },
          { width: 100, label: 'Gifted', dataKey: 'gifted' },
          { width: 200, label: 'History', dataKey: 'history' },
        ]}
        headerHeight={48}
        rowHeight={48}
      />
    </React.Fragment>
  )
}

InstrumentTable.propTypes = {
  history: PropTypes.object.isRequired,
  records: PropTypes.array.isRequired,
}

export default withRouter(InstrumentTable)

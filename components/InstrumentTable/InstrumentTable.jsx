import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { TableCell, withStyles, Typography } from '@material-ui/core'
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
    if (dataKey === 'Condition' || dataKey === 'Quality') {
      cellData = stars(cellData)
    } else if (
      dataKey === 'Ready To Go' ||
      dataKey === 'Rosin' ||
      dataKey === 'Bow' ||
      dataKey === 'Shoulder Rest/Endpin Rest' ||
      dataKey === 'Gifted to student'
    ) {
      cellData = yesOrNo(cellData)
    } else if (
      dataKey === 'Maintenance Notes' ||
      dataKey === 'Condition Notes' ||
      dataKey === 'History'
    ) {
      cellData = truncateText(cellData, 15)
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
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
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
  Number: '',
  Type: '',
  Size: '',
  'Assigned To': '',
  Location: '',
  Condition: 0,
  Quality: 0,
  'Gifted to student': false,
}

const compareField = (field, a, b, sortDirection) => {
  const aValue = a.fields[field] || defaultForField[field]
  const bValue = b.fields[field] || defaultForField[field]
  if (aValue < bValue) {
    return -sortDirection
  }
  if (bValue < aValue) {
    return sortDirection
  }
  return 0
}

const InstrumentTable = ({ records, history }) => {
  const [rows, setRows] = useState(records)
  const [sortedBy, setSortedBy] = useState('')
  const [sortDirection, setSortDirection] = useState(1)

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

  const onRowClick = ({ rowData }) => history.push(`/instrument/${rowData.id}`)

  return (
    <React.Fragment>
      <VirtualizedTable
        sortBy={sortedBy}
        sortDirection={sortDirection === 1 ? 'DESC' : 'ASC'}
        sortByField={sortByField}
        rowCount={rows.length}
        rowGetter={({ index }) => ({ ...rows[index].fields, id: rows[index].id })}
        onRowClick={onRowClick}
        columns={[
          { width: 120, label: 'Number', dataKey: 'Number' },
          { width: 140, label: 'Type', dataKey: 'Instrument Type' },
          { width: 110, label: 'Size', dataKey: 'Size' },
          { width: 180, label: 'Assigned To', dataKey: 'Assigned To' },
          { width: 210, label: 'Location', dataKey: 'Location' },
          { width: 120, label: 'Condition', dataKey: 'Condition' },
          { width: 100, label: 'Quality', dataKey: 'Quality' },
          // { width: 200, label: 'Maintenance Notes', dataKey: 'Maintenance Notes' },
          // { width: 200, label: 'Condition Notes', dataKey: 'Condition Notes' },
          // { width: 80, label: 'Ready', dataKey: 'Ready To Go' },
          // { width: 80, label: 'Rosin', dataKey: 'Rosin' },
          // { width: 80, label: 'Bow', dataKey: 'Bow' },
          // {
          //   width: 80,
          //   label: 'Shoulder Rest/EndpinRest',
          //   dataKey: 'Shoulder Rest/EndpinRest',
          // },
          { width: 100, label: 'Gifted', dataKey: 'Gifted to student' },
          { width: 200, label: 'History', dataKey: 'History' },
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

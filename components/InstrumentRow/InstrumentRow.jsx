import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableCell } from '@material-ui/core'
import { stars, yesOrNo, truncateText } from '../../libs/display'
import { withRouter } from 'react-router-dom'
import { TooltipIconButton } from '..'
import EditIcon from '@material-ui/icons/Edit'

const InstrumentRow = ({ record, columns, history }) => {
  let photoUrl = ''
  if (record.fields.Photo) {
    photoUrl = record.fields.Photo[0].thumbnails.small.url
  }
  return (
    <TableRow
      component="tr"
      hover
      onClick={() => history.push(`/instrument/${record.id}`)}
    >
      <TableCell component="td">
        <TooltipIconButton
          title="Edit"
          onClick={() => history.push(`/instrument/${record.id}?edit=true`)}
        >
          <EditIcon />
        </TooltipIconButton>
      </TableCell>
      {columns.includes('Photo') ? (
        <TableCell component="td">
          <img src={photoUrl} />
        </TableCell>
      ) : null}
      {columns.includes('Number') ? (
        <TableCell component="td">{record.fields['Number'] || ''}</TableCell>
      ) : null}
      {columns.includes('Instrument Type') ? (
        <TableCell component="td">{record.fields['Instrument Type'] || ''}</TableCell>
      ) : null}
      {columns.includes('Size') ? (
        <TableCell component="td">{record.fields['Size'] || ''}</TableCell>
      ) : null}
      {columns.includes('Assigned To') ? (
        <TableCell component="td">{record.fields['Assigned To'] || ''}</TableCell>
      ) : null}
      {columns.includes('Location') ? (
        <TableCell component="td">{record.fields['Location'] || ''}</TableCell>
      ) : null}
      {columns.includes('Condition') ? (
        <TableCell component="td">{stars(record.fields['Condition']) || ''}</TableCell>
      ) : null}
      {columns.includes('Quality') ? (
        <TableCell component="td">{stars(record.fields['Quality']) || ''}</TableCell>
      ) : null}
      {columns.includes('Condition Notes') ? (
        <TableCell component="td">
          {truncateText(record.fields['Condition Notes'], 15) || ''}
        </TableCell>
      ) : null}
      {columns.includes('Maintenance Notes') ? (
        <TableCell component="td">
          {truncateText(record.fields['Maintenance Notes'], 15) || ''}
        </TableCell>
      ) : null}
      {columns.includes('Ready To Go') ? (
        <TableCell component="td">
          {yesOrNo(record.fields['Ready To Go']) || ''}
        </TableCell>
      ) : null}
      {columns.includes('Rosin') ? (
        <TableCell component="td">{yesOrNo(record.fields['Rosin']) || ''}</TableCell>
      ) : null}
      {columns.includes('Bow') ? (
        <TableCell component="td">{yesOrNo(record.fields['Bow']) || ''}</TableCell>
      ) : null}
      {columns.includes('Shoulder Rest/Endpin Rest') ? (
        <TableCell component="td">
          {yesOrNo(record.fields['Shoulder Rest/Endpin Rest']) || ''}
        </TableCell>
      ) : null}
      {columns.includes('Gifted to student') ? (
        <TableCell component="td">
          {yesOrNo(record.fields['Gifted to student']) || ''}
        </TableCell>
      ) : null}
      {columns.includes('History') ? (
        <TableCell component="td">
          {truncateText(record.fields['History'], 15) || ''}
        </TableCell>
      ) : null}
    </TableRow>
  )
}

InstrumentRow.propTypes = {
  record: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

export default withRouter(InstrumentRow)

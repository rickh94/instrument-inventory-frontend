import React from 'react'
import PropTypes from 'prop-types'
import { Tooltip, IconButton, Typography } from '@material-ui/core'

const TooltipIconButton = ({ children, title, ...buttonProps }) => (
  <Tooltip title={title} data-testid="tooltip">
    <IconButton {...buttonProps}>
      {children}
      <Typography variant="srOnly" data-testid="sr-text">{title}</Typography>
    </IconButton>
  </Tooltip>
)

TooltipIconButton.propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
}

export default TooltipIconButton

import React from 'react'
import TooltipIconButton from './TooltipIconButton'
import AddIcon from '@material-ui/icons/Add'
import { render } from '@testing-library/react'
import 'jest-dom/extend-expect'

describe('<TooltipIconButton />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <TooltipIconButton title="Add Test">
        <AddIcon />
      </TooltipIconButton>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders children', () => {
    const { container } = render(
      <TooltipIconButton title="Add Test">
        <AddIcon data-testid="test-icon" />
      </TooltipIconButton>
    )

    expect(container.querySelector('[data-testid="test-icon"]')).toBeInTheDocument()
  })

  it('renders title from props as sr-only text and tooltip', () => {
    const { container } = render(
      <TooltipIconButton title="Add Test">
        <AddIcon />
      </TooltipIconButton>
    )
    expect(container.querySelector('span[data-testid="sr-text"]')).toHaveTextContent('Add Test')
    expect(container.querySelector('[data-testid="tooltip"]')).toHaveTextContent('Add Test')
  })
})

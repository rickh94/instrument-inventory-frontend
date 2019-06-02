import React from 'react'
import LoadingHeader from './LoadingHeader'
import { render } from '@testing-library/react'
import 'jest-dom/extend-expect'

jest.mock('@material-ui/core/CircularProgress', () => () => <div id="mock-loader" />)

describe('<LoadingHeader />', () => {
  it('matches snapshot', () => {
    const { container } = render(<LoadingHeader isLoading={false} title="test" />)
    expect(container).toMatchSnapshot()
  })

  it('renders title from props', () => {
    const { container, getByText } = render(
      <LoadingHeader isLoading={false} title="test title" />
    )
    expect(getByText('test title')).toBeInTheDocument()
  })

  it('shows a loader if isLoading is true', () => {
    const { container } = render(<LoadingHeader isLoading={true} title="test title" />)
    expect(container.querySelector('div#mock-loader')).toBeInTheDocument()
  })

  it('does not show a loader if isLoading is false', () => {
    const { container } = render(<LoadingHeader isLoading={false} title="test title" />)
    expect(container.querySelector('div#mock-loader')).not.toBeInTheDocument()
  })
})

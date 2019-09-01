import React from 'react'
import Search from './Search'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TestEverything } from '../../testHelpers'

describe('<Search />', () => {
  it('matches snapshot', () => {
    const { container } = render(<Search />, { wrapper: TestEverything })
    expect(container).toMatchSnapshot()
  })
})

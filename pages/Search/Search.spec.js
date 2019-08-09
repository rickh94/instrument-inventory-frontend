import React from 'react'
import Search from './Search'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

describe('<Search />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <Search setSearchResults={jest.fn()} searchResults={[]} showAlert={jest.fn()} />
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
  })
})

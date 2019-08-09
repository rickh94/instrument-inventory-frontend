import React from 'react'
import Home from './Home'
import { render } from '@testing-library/react'
import { API } from 'aws-amplify'
import { MemoryRouter } from 'react-router-dom'

describe('<Home />', () => {
  it('matches snapshot', () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve([]))
    const { container } = render(
      <MemoryRouter>
        <Home
          history={{ push: jest.fn() }}
          showAlert={jest.fn()}
          setSearchResults={jest.fn()}
        />
      </MemoryRouter>
    )
  })
})

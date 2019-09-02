import React from 'react'
import Home from '../../pages/Home'
import { render, cleanup } from '../../test-utils'
import { API } from 'aws-amplify'

beforeEach(cleanup)
beforeAll(() => {
  console.error = jest.fn()
})

describe('<Home />', () => {
  test('matches snapshot', () => {
    API.get = () => Promise.resolve([])
    const { container } = render(<Home history={{ push: jest.fn() }} />)
    expect(container).toMatchSnapshot()
  })

  test('renders find instrument', () => {
    API.get = () => Promise.resolve([])
    const { queryByText } = render(<Home history={{ push: jest.fn() }} />)

    expect(queryByText('Find an Instrument')).toBeTruthy()
  })

  test('renders todo list', () => {
    API.get = () => Promise.resolve([])
    const { queryByText } = render(<Home history={{ push: jest.fn() }} />)

    expect(queryByText('Todo List')).toBeTruthy()
  })
})

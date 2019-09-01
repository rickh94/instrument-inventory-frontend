import React from 'react'
import Home from './Home'
import { render, cleanup } from '@testing-library/react'
import { API } from 'aws-amplify'
import { TestEverything } from '../../test-utils'

beforeEach(cleanup)
describe('<Home />', () => {
  test('matches snapshot', () => {
    API.get = () => Promise.resolve([])
    const { container } = render(<Home history={{ push: jest.fn() }} />, {
      wrapper: TestEverything,
    })
    expect(container).toMatchSnapshot()
  })

  test('renders find instrument', () => {
    API.get = () => Promise.resolve([])
    const { queryByText } = render(<Home history={{ push: jest.fn() }} />, {
      wrapper: TestEverything,
    })

    expect(queryByText('Find an Instrument')).toBeTruthy()
  })
  
  test('renders todo list', () => {
    API.get = () => Promise.resolve([])
    const { queryByText } = render(<Home history={{ push: jest.fn() }} />, {
      wrapper: TestEverything,
    })

    expect(queryByText('Todo List')).toBeTruthy()
  })
})

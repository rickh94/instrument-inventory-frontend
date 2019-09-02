import React from 'react'
import TodoList from '../../components/TodoList'
import { render, fireEvent, cleanup } from '../../test-utils'
import { API } from 'aws-amplify'

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
})
beforeEach(cleanup)
// eslint-disable-next-line no-undef
const flushPromises = () => new Promise(setImmediate)

describe('TodoList', () => {
  it('matches snapshot', () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve([{ id: 1 }]))
    const { container } = render(<TodoList />)
    expect(container).toMatchSnapshot()
  })

  it('renders returned items', async () => {
    expect.assertions(3)
    API.get = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          completed: false,
          content: 'some content',
          relevantInstrument: 'an instrument',
        },
        { id: 2, completed: false, content: 'some other content' },
      ])
    )
    const { queryByText } = render(<TodoList />)
    await flushPromises()
    expect(queryByText('some content')).toBeTruthy()
    expect(queryByText('an instrument')).toBeTruthy()
    expect(queryByText('some other content')).toBeTruthy()
  })

  it('gets completed todos', async () => {
    expect.assertions(3)
    API.get = jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 1,
          completed: true,
          content: 'some content',
          relevantInstrument: 'an instrument',
        },
      ])
    )
    const { container, queryByText } = render(<TodoList showAlert={jest.fn()} />)
    fireEvent.click(container.querySelector('tr[data-testid="toggle-completed"]'))
    await flushPromises()

    expect(API.get).toHaveBeenCalledWith('instrument-inventory', 'todos/completed')
    expect(queryByText('some content')).toBeTruthy()
    expect(queryByText('Show Incomplete')).toBeTruthy()
  })
})

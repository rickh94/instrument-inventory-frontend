import React from 'react'
import TodoList from './TodoList'
import { render } from '@testing-library/react'
import { API } from 'aws-amplify'

describe('TodoList', () => {
  it('matches snapshot', () => {
    API.post = jest.fn().mockImplementation(() => Promise.resolve([{ id: 1 }]))
    const { container } = render(<TodoList showAlert={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})

/* eslint-disable no-console */
import React from 'react'
import { render, fireEvent, cleanup, showAlert, flushPromises } from '../../test-utils'
import { FindInstrument } from '../../components/FindInstrument'
import 'jest-dom/extend-expect'
import { API } from 'aws-amplify'

beforeAll(() => {
  console.error = jest.fn()
})
beforeEach(cleanup)

describe('FindInstrument', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <FindInstrument showMultipleResults={jest.fn()} history={{ push: jest.fn() }} />
    )
    expect(container).toMatchSnapshot()
  })

  it('sets search term on change and clears search term on clear click', () => {
    const { container } = render(<FindInstrument history={{ push: jest.fn() }} />)
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: 'test' },
    })
    expect(container.querySelector('input#scanner-field')).toHaveAttribute(
      'value',
      'test'
    )

    fireEvent.click(container.querySelector('button[data-testid="clear-button"]'))
    expect(container.querySelector('input#scanner-field')).toHaveAttribute('value', '')
  })

  it('calls amplify api and handles a single result', async () => {
    expect.assertions(3)
    const showMultipleResults = jest.fn()
    const push = jest.fn()
    API.post = jest.fn().mockImplementation(() => Promise.resolve([{ id: 1 }]))

    const { container } = render(
      <FindInstrument showMultipleResults={showMultipleResults} history={{ push }} />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: '1-001' },
    })
    fireEvent.click(container.querySelector('button[data-testid="submit-button"]'))
    expect(API.post).toHaveBeenCalledWith('instrument-inventory', 'search/number', {
      body: { term: '1-001' },
    })

    await flushPromises()

    expect(showAlert).toBeCalledWith('Instrument found')
    expect(push).toBeCalledWith('/instrument/1')
    showAlert.mockReset()
  })

  it('calls amplify api on submit clicked and handles multiple results', async () => {
    expect.assertions(2)
    const showMultipleResults = jest.fn()
    const push = jest.fn()
    const searchResults = [{ id: 1 }, { id: 2 }, { id: 3 }]
    API.post = jest.fn().mockImplementation(() => Promise.resolve(searchResults))

    const { container } = render(
      <FindInstrument history={{ push }} showMultipleResults={showMultipleResults} />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: 'test' },
    })
    fireEvent.click(container.querySelector('button[data-testid="submit-button"]'))
    expect(API.post).toHaveBeenCalledWith(
      'instrument-inventory',
      'search/assigned-history',
      {
        body: { term: 'test' },
      }
    )

    await flushPromises()

    expect(showMultipleResults).toBeCalledWith(searchResults)
  })
})

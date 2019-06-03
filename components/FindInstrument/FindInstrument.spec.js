import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { FindInstrument, getSearchParameters } from './FindInstrument'
import 'jest-dom/extend-expect'
import { API } from 'aws-amplify'

const flushPromises = () => new Promise(setImmediate)

describe('FindInstrument', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <FindInstrument
        showMultipleResults={jest.fn()}
        showAlert={jest.fn()}
        history={{ push: jest.fn() }}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('sets search term on change and clears search term on clear click', () => {
    const { container } = render(
      <FindInstrument
        showMultipleResults={jest.fn()}
        showAlert={jest.fn()}
        history={{ push: jest.fn() }}
      />
    )
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
    const showAlert = jest.fn()
    API.post = jest.fn().mockImplementation(() => Promise.resolve([{ id: 1 }]))

    const { container } = render(
      <FindInstrument
        showMultipleResults={showMultipleResults}
        showAlert={showAlert}
        history={{ push }}
      />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: '1-001' },
    })
    fireEvent.click(container.querySelector('button[data-testid="submit-button"]'))
    expect(API.post).toHaveBeenCalledWith('instrument-inventory', 'search/number', {
      body: { instrumentNumber: '1-001' },
    })

    await flushPromises()

    expect(showAlert).toBeCalledWith('Instrument found')
    expect(push).toHaveBeenCalledWith('/instrument/1')
  })

  it('calls amplify api on submit clicked and handles multiple results', async () => {
    expect.assertions(2)
    const showMultipleResults = jest.fn()
    const push = jest.fn()
    const showAlert = jest.fn()
    const searchResults = [{ id: 1 }, { id: 2 }, { id: 3 }]
    API.post = jest.fn().mockImplementation(() => Promise.resolve(searchResults))

    const { container } = render(
      <FindInstrument
        showMultipleResults={showMultipleResults}
        showAlert={showAlert}
        history={{ push }}
      />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: 'test' },
    })
    fireEvent.click(container.querySelector('button[data-testid="submit-button"]'))
    expect(API.post).toHaveBeenCalledWith('instrument-inventory', 'search/assigned', {
      body: { assignedTo: 'test' },
    })

    await flushPromises()

    expect(showMultipleResults).toBeCalledWith(searchResults)
  })
})

describe('getSearchParameters', () => {
  it('returns number if it is an instrument ', () => {
    expect(getSearchParameters('1-201')).toEqual(['search/number', 'instrumentNumber'])
  })

  it('returns assigned to if it is a name', () => {
    expect(getSearchParameters('random name')).toEqual([
      'search/assigned',
      'assignedTo',
    ])
  })
})

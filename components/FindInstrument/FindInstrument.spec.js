import React from 'react'
import ReactDOM from 'react-dom'
import { render } from '@testing-library/react'
import { FindInstrument } from './FindInstrument'
import 'jest-dom/extend-expect'

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

  // it('clears search term on clear click', () => {
  //   const { container, getByTestId } = render(
  //     <FindInstrument
  //       showMultipleResults={jest.fn()}
  //       showAlert={jest.fn()}
  //       history={{ push: jest.fn() }}
  //     />
  //   )
  //   const clearButton = getByTestId('clear-button')
  //   const scannerField = getByTestId('scanner-field')

  // })
})

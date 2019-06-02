import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { FindInstrument } from './FindInstrument'
import 'jest-dom/extend-expect'

// jest.mock('../CustomFields', () => ({ Scanner: (props) => <div id="mock-scanner-field" {...props} /> }))

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
  //   expect(getByTestId('scanner-field')).hasAttribute('value', 'test')

  //   fireEvent.click(container.querySelector('button[data-testid="clear-button"]'))
  //   expect(getByTestId('scanner-field')).hasAttribute('value', '')
  // })
})

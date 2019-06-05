import React from 'react'
import ScannerField from './ScannerField'
import { render, fireEvent } from '@testing-library/react'
import { Scanner } from '..'

import 'jest-dom/extend-expect'
import TooltipIconButton from '../TooltipIconButton'

jest.mock('../Scanner/Scanner', () => () => <div id="test-scanner" />)

describe('<ScannerField />', () => {
  it('to match snapshot', () => {
    const { container } = render(
      <ScannerField error="" value="" setValue={jest.fn()} label="" />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders passed in values', () => {
    const { container, getByText, getAllByTestId } = render(
      <ScannerField
        error="testerror"
        value="testvalue"
        setValue={jest.fn()}
        label="testlabel"
      />
    )
    expect(getByText('testlabel')).toHaveClass('MuiFormLabel-root')
    expect(getByText('testerror')).toBeTruthy()
    expect(container.querySelector('input#scanner-field')).toHaveAttribute(
      'value',
      'testvalue'
    )
  })

  it('switches modes on click', () => {
    const { container } = render(
      <ScannerField
        error="testerror"
        value="testvalue"
        setValue={jest.fn()}
        label="testlabel"
      />
    )
    expect(container.querySelector('div#test-scanner')).not.toBeInTheDocument()
    fireEvent.click(container.querySelector('button[data-testid="scan-button"]'))

    expect(container.querySelector('div#test-scanner')).toBeInTheDocument()
  })

  it('sets value with prop function', () => {
    const setValueMock = jest.fn()
    const { container } = render(
      <ScannerField
        error="testerror"
        value="testvalue"
        setValue={setValueMock}
        label="testlabel"
      />
    )
    fireEvent.change(container.querySelector('input#scanner-field'), {
      target: { value: 'new value' },
    })

    expect(setValueMock).toHaveBeenCalledWith('new value')
  })
})

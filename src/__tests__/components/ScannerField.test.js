import React from 'react'
import ScannerField from '../../components/ScannerField'
import { render, fireEvent } from '@testing-library/react'

import 'jest-dom/extend-expect'

jest.mock(
  '../../components/Scanner/Scanner',
  () =>
    function FakeScanner() {
      return <div id="test-scanner" />
    }
)

describe('<ScannerField />', () => {
  test('to match snapshot', () => {
    const { container } = render(
      <ScannerField error="" value="" setValue={jest.fn()} label="" />
    )
    expect(container).toMatchSnapshot()
  })

  test('renders passed in values', () => {
    const { container, getByText } = render(
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

  test('switches modes on click', () => {
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

  test('sets value with prop function', () => {
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
import React from 'react'
import { SchemaScannerField } from './SchemaScannerField'
import { render, cleanup, fireEvent } from '@testing-library/react'
import Quagga from 'quagga'

afterEach(cleanup)

describe('<SchemaScannerField />', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <SchemaScannerField onChange={jest.fn()} value="" error={null} label="Test" />
    )
    expect(container).toMatchSnapshot()
  })

  test('renders an input and label', () => {
    const { container, queryByText, queryByTestId } = render(
      <SchemaScannerField onChange={jest.fn()} value="" error={null} label="Test" />
    )
    expect(queryByText('Test')).toBeTruthy()
    expect(container.querySelector('input')).toBeTruthy()
    expect(queryByTestId('scanner-input')).toBeTruthy()
  })

  test('renders scanner when scan button is clicked', () => {
    Quagga.init = jest.fn().mockImplementation()
    Quagga.onDetected = jest.fn().mockImplementation()
    Quagga.stop = jest.fn().mockImplementation()
    const { queryByTestId } = render(
      <SchemaScannerField onChange={jest.fn()} value="" error={null} label="Test" />
    )
    fireEvent.click(queryByTestId('scan-button'))
    expect(queryByTestId('scanner')).toBeTruthy()
  })

  test('closes scanner when stop scanning is clicked ', () => {
    Quagga.init = jest.fn().mockImplementation()
    Quagga.onDetected = jest.fn().mockImplementation()
    Quagga.stop = jest.fn().mockImplementation()
    const { queryByTestId } = render(
      <SchemaScannerField onChange={jest.fn()} value="" error={null} label="Test" />
    )
    fireEvent.click(queryByTestId('scan-button'))
    expect(queryByTestId('scanner')).toBeTruthy()
    fireEvent.click(queryByTestId('stop-scanning-button'))
    expect(queryByTestId('scanner')).toBeFalsy()

  })
})

import React from 'react'
import Scanner from './Scanner'
import { render } from '@testing-library/react'
import Quagga from 'quagga'

describe('<Scanner />', () => {
  it('matches snapshot', () => {
    Quagga.init = jest.fn()
    Quagga.onDetected = jest.fn()
    Quagga.stop = jest.fn()
    const onDetectedMock = jest.fn()
    const { container } = render(<Scanner onDetected={onDetectedMock} />)
    expect(container).toMatchSnapshot()
    expect(Quagga.init).toHaveBeenCalled()
    expect(Quagga.onDetected).toHaveBeenCalledWith(onDetectedMock)
  })
})

import React from 'react'
import Scanner from '../../components/Scanner/Scanner'
import { render } from '../../test-utils'
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

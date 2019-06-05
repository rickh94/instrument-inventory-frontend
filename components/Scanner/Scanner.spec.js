import React from 'react'
import Scanner from './Scanner'
import { render } from '@testing-library/react'
import Quagga from 'quagga'

describe('<Scanner />', () => {
  it('matches snapshot', () => {
    Quagga.init = jest.fn().mockImplementation(() => {})
    const { container } = render(<Scanner onDetected={jest.fn()} />)
    expect(container).toMatchSnapshot()
  })
})

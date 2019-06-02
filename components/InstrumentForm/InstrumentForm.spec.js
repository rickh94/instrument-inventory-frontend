import React from 'react'
import InstrumentForm from './InstrumentForm'
import { render } from '@testing-library/react'

describe('InstrumentForm', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <InstrumentForm
        onSubmit={jest.fn()}
        setValue={jest.fn()}
        errors={{}}
        setErrors={jest.fn()}
        validateForm={jest.fn()}
      />
    )
  })
})

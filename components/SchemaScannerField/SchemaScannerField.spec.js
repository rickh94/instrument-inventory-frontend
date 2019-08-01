import React from 'react'
import { SchemaScannerField } from './SchemaScannerField'
import { render } from '@testing-library/react'

describe('<SchemaScannerField />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <SchemaScannerField onChange={jest.fn()} value="" error={null} label="Test" />
    )
    expect(container).toMatchSnapshot()
  })
})

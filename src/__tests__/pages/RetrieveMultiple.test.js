import React from 'react'
import RetrieveMultiple from '../../pages/RetrieveMultiple'
import { render } from '../../test-utils'

describe('<RetrieveMultiple />', () => {
  it('matches snapshot', () => {
    const { container } = render(<RetrieveMultiple />)
    expect(container).toMatchSnapshot()
  })
})

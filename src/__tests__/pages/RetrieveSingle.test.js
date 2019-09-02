import React from 'react'
import RetrieveSingle from '../../pages/RetrieveSingle'
import { render, cleanup } from '../../test-utils'

const schema = {
  components: {
    schemas: {
      RetrieveSingle: {
        title: 'RetrieveSingle',
        type: 'object',
        properties: {
          number: {
            title: 'Instrument Number',
            description: 'The number of the instrument to retrieve',
            type: 'string',
          },
        },
        required: ['number'],
      },
    },
  },
}

afterEach(cleanup)

describe('<RetrieveSingle />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <RetrieveSingle
        schema={schema}
        history={{ push: jest.fn() }}
        showAlert={jest.fn()}
      />
    )
    expect(container).toMatchSnapshot()
  })
})

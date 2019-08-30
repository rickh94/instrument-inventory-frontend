import React from 'react'
import Filter from './Filter'
import { render } from '@testing-library/react'
import { TestTheme, TestEverything } from '../../testHelpers'

const schema = {
  openapi: '3.0.2',
  components: {
    schemas: {
      InstrumentFilter: {
        title: 'Instrument Filter',
        type: 'object',
        properties: {
          location: {
            title: 'Location',
            enum: ['Office', 'Storage'],
          },
          notAssigned: {
            default: false,
            type: 'boolean',
          },
          size: {
            title: 'Size',
            enum: ['4/4', '3/4', '1/2', '1/4'],
          },
          type: {
            enum: ['Violin', 'Viola', 'Cello', 'Bass', 'Violin strung as viola'],
            title: 'Instrument Type',
          },
        },
      },
    },
  },
}

describe('<Filter />', () => {
  test('matches snapshot', () => {
    const { container } = render(
      <TestEverything schema={schema}>
        <Filter history={{ push: jest.fn() }} />
      </TestEverything>
    )
    expect(container).toMatchSnapshot()
  })
})

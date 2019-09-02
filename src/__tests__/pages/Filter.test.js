import React from 'react'
import Filter from '../../pages/Filter'
import { render, cleanup } from '../../test-utils'

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
            title: 'Search only unassigned instruments',
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

afterEach(cleanup)

describe('<Filter />', () => {
  test('matches snapshot', () => {
    const { container } = render(<Filter history={{ push: jest.fn() }} />, {}, schema)
    expect(container).toMatchSnapshot()
  })

  test('renders correct fields', () => {
    const { queryByText } = render(<Filter history={{ push: jest.fn() }} />, {}, schema)
    expect(queryByText('Location')).toBeTruthy()
    expect(queryByText('Search only unassigned instruments')).toBeTruthy()
    expect(queryByText('Size')).toBeTruthy()
    expect(queryByText('Instrument Type')).toBeTruthy()
  })
})

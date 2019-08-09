import React from 'react'
import Filter from './Filter'
import { render } from '@testing-library/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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
  it('matches snapshot', () => {
    const { container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <Filter
          history={{ push: jest.fn() }}
          schema={schema}
          showAlert={jest.fn()}
          filterResults={[]}
          setFilterResults={jest.fn()}
        />
      </MuiThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

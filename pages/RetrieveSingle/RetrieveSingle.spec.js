import React from 'react'
import RetrieveSingle from './RetrieveSingle'
import { render, cleanup } from '@testing-library/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

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
      <MuiThemeProvider theme={createMuiTheme()}>
        <RetrieveSingle
          schema={schema}
          history={{ push: jest.fn() }}
          showAlert={jest.fn()}
        />
      </MuiThemeProvider>
    )
    expect(container).toMatchSnapshot()
  })
})

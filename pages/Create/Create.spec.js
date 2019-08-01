import React from 'react'
import Create from './Create'
import { render } from '@testing-library/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

describe('<Create />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <Create
          schema={{
            components: {
              schemas: { Instrument: {properties: {}} },
            },
          }}
          history={{ push: jest.fn() }}
          showAlert={jest.fn()}
        />
      </MuiThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})

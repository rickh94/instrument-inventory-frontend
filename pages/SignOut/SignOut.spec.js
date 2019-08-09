import React from 'react'
import SignOut from './SignOut'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const schema = {
  components: {
    schemas: {
      SignOut: {
        title: 'SignOut',
        type: 'object',
        properties: {
          number: {
            title: 'Instrument Number',
            description: 'Instrument Number to sign out',
            type: 'string',
          },
          assignedTo: {
            title: 'Assigned To',
            description: 'Name of the Person to sign out to',
            type: 'string',
          },
          location: {
            title: 'Location',
            description: 'Primary location of instrument',
            enum: [
              'Grant Elementary School',
              'Hedgepath Middle School',
              'Wilson Elementary School',
              'Trenton High School',
              'Columbus Elementary School',
              'Office',
              'Storage',
              'Trade',
              'Maintenance',
              'Transit',
              'Unknown',
            ],
            type: 'string',
          },
        },
        required: ['number', 'assignedTo', 'location'],
      },
    },
  },
}

afterEach(cleanup)

describe('<SignOut />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <MuiThemeProvider theme={createMuiTheme()}>
          <SignOut
            schema={schema}
            history={{ push: jest.fn() }}
            showAlert={jest.fn()}
            match={{ params: {} }}
          />
        </MuiThemeProvider>
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
  })
})

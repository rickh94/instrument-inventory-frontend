import React from 'react'
import Create from './Create'
import { render } from '@testing-library/react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

const schema = {
  components: {
    schemas: {
      Instrument: {
        type: 'object',
        properties: {
          number: {
            title: 'Instrument Number',
            description: 'The inventory number of the instrument',
            type: 'string',
          },
          size: {
            title: 'Instrument Size',
            description: 'The fractional or inch size of the instrument',
            enum: [
              '1/16',
              '1/10',
              '1/8',
              '1/4',
              '1/2',
              '3/4',
              '7/8',
              '4/4',
              '9"',
              '10"',
              '11"',
              '12"',
              '13"',
              '14"',
              '15"',
              '15.5"',
              '16"',
              '16.5"',
              '17"',
            ],
            type: 'string',
          },
          type: {
            title: 'Instrument Type',
            description: 'What kind of instrument',
            enum: ['Violin', 'Viola', 'Violin strung as viola', 'Cello', 'Bass'],
            type: 'string',
          },
          location: {
            title: 'Instrument Location',
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
          assignedTo: {
            title: 'Assigned To',
            description: 'Who it is signed out to',
            type: 'string',
          },
          maintenanceNotes: {
            title: 'Maintenance Notes',
            maxLength: 200,
            type: 'string',
          },
          conditionNotes: {
            title: 'Condition Notes',
            maxLength: 200,
            type: 'string',
          },
          condition: {
            title: 'Condition',
            exclusiveMaximum: 6,
            gte: 0,
            type: 'integer',
          },
          quality: {
            title: 'Quality',
            exclusiveMaximum: 6,
            gte: 0,
            type: 'integer',
          },
          gifted: {
            title: 'Gifted To Student',
            description:
              'Whether it has been given permanently to the student it is assigned to.',
            default: false,
            type: 'boolean',
          },
        },
      },
    },
  },
}

describe('<Create />', () => {
  it('matches snapshot', () => {
    const { container } = render(
      <MuiThemeProvider theme={createMuiTheme()}>
        <Create schema={schema} history={{ push: jest.fn() }} showAlert={jest.fn()} />
      </MuiThemeProvider>
    )

    expect(container).toMatchSnapshot()
  })
})

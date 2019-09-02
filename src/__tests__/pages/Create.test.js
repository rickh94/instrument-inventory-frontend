import React from 'react'
import Create from '../../pages/Create'
import { render, cleanup, fireEvent, flushPromises, showAlert } from '../../test-utils'
import { API } from 'aws-amplify'

beforeAll(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
})
afterEach(cleanup)

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
  test('matches snapshot', () => {
    const { container } = render(<Create history={{ push: jest.fn() }} />, {}, schema)

    expect(container).toMatchSnapshot()
  })

  test('renders loading header', () => {
    const { queryByTestId } = render(
      <Create history={{ push: jest.fn() }} />,
      {},
      schema
    )

    expect(queryByTestId('loading-header')).toBeTruthy()
  })

  test('renders schema form if schema is provided', () => {
    const { queryByTestId } = render(
      <Create history={{ push: jest.fn() }} />,
      {},
      schema
    )

    expect(queryByTestId('schema-form')).toBeTruthy()
  })

  test('renders instrument from schema', () => {
    const { queryByText } = render(<Create history={{ push: jest.fn() }} />, {}, schema)
    expect(queryByText('Instrument Number')).toBeTruthy()
    expect(queryByText('Instrument Size')).toBeTruthy()
    expect(queryByText('Instrument Type')).toBeTruthy()
    expect(queryByText('Instrument Location')).toBeTruthy()
    expect(queryByText('Assigned To')).toBeTruthy()
    expect(queryByText('Maintenance Notes')).toBeTruthy()
    expect(queryByText('Condition Notes')).toBeTruthy()
    expect(queryByText('Condition')).toBeTruthy()
    expect(queryByText('Quality')).toBeTruthy()
    expect(queryByText('Gifted To Student')).toBeTruthy()
  })

  test('api is called on submit', async () => {
    const smallSchema = {
      components: {
        schemas: {
          Instrument: {
            type: 'object',
            properties: {
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
              gifted: {
                title: 'Gifted to student',
                type: 'boolean',
              },
            },
          },
        },
      },
    }
    API.post = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ id: 5, item: { number: '1-001', type: 'Violin' } })
      )
    const push = jest.fn()
    const { container } = render(<Create history={{ push }} />, {}, smallSchema)
    fireEvent.change(container.querySelector('input[name="assignedTo"]'), {
      target: { value: 'assigned value' },
    })
    fireEvent.change(container.querySelector('input[name="maintenanceNotes"]'), {
      target: { value: 'maintenance notes value' },
    })
    fireEvent.change(container.querySelector('input[name="conditionNotes"]'), {
      target: { value: 'condition notes value' },
    })

    fireEvent.click(container.querySelector('button[type="submit"]'))

    await flushPromises()

    expect(API.post).toHaveBeenCalledWith('instrument-inventory', 'instruments', {
      body: {
        assignedTo: 'assigned value',
        maintenanceNotes: 'maintenance notes value',
        conditionNotes: 'condition notes value',
      },
    })
    expect(push).toHaveBeenCalledWith('/instrument/5')
    expect(showAlert).toHaveBeenCalledWith('Violin 1-001 created')
    showAlert.mockReset()
  })
})

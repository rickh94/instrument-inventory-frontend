import React from 'react'
import Gifted from '../../pages/Gifted'
import { render, cleanup, flushPromises } from '../../test-utils'
import { API } from 'aws-amplify'

const mockInstruments = [
  {
    id: 2,
    number: '4-002',
    type: 'Violin',
    size: '1/4',
    location: 'Storage',
    condition: 4,
    quality: 3,
    gifted: true,
  },
  {
    id: 3,
    number: '3-003',
    type: 'Violin',
    size: '3/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: true,
    history: ['one', 'two', 'three'],
  },
  {
    id: 4,
    number: '2-004',
    type: 'Violin',
    size: '1/2',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: true,
    history: ['one', 'two', 'three'],
  },
  {
    id: 6,
    number: 'C1-002',
    type: 'Cello',
    size: '4/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: true,
    history: ['one', 'two', 'three'],
  },
  {
    id: 8,
    number: 'C3-004',
    type: 'Cello',
    size: '3/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: true,
    history: ['one', 'two', 'three'],
  },
]

beforeEach(cleanup)
beforeAll(() => {
  console.error = jest.fn()
})

describe('<Gifted />', () => {
  test('renders', async () => {
    expect.assertions(6)
    API.get = jest.fn().mockImplementation(() => Promise.resolve(mockInstruments))
    const { container, findAllByText } = render(<Gifted />)
    expect(container).toMatchSnapshot()
    await flushPromises()
    expect(API.get).toHaveBeenCalledWith('instrument-inventory', 'filter/gifted')
    expect(findAllByText('Cello').length).not.toBe(0)
    expect(findAllByText('Violin').length).not.toBe(0)
    expect(findAllByText('C3-004').length).not.toBe(0)
    expect(findAllByText('Test Name').length).not.toBe(0)
  })
})

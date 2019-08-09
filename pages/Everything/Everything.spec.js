import React from 'react'
import Everything from './Everything'
import { render, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { API } from 'aws-amplify'

const flushPromises  = new Promise(setImmediate)

const mockInstruments = [
  {
    id: 1,
    number: '1-001',
    type: 'Violin',
    size: '4/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: false,
    history: ['one', 'two', 'three'],
  },
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
    gifted: false,
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
    gifted: false,
    history: ['one', 'two', 'three'],
  },
  {
    id: 5,
    number: 'C1-001',
    type: 'Cello',
    size: '4/4',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: false,
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
    gifted: false,
    history: ['one', 'two', 'three'],
  },
  {
    id: 7,
    number: 'C2-003',
    type: 'Cello',
    size: '1/2',
    assignedTo: 'Test Name',
    location: 'Office',
    condition: 4,
    quality: 3,
    gifted: false,
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
    gifted: false,
    history: ['one', 'two', 'three'],
  },
]

afterEach(cleanup)

describe('<Everything />', () => {
  it('matches snapshot', () => {
    API.get = jest.fn().mockImplementation(() => Promise.resolve(mockInstruments))
    const { container } = render(
      <MemoryRouter>
        <Everything showAlert={jest.fn()} />
      </MemoryRouter>
    )
    expect(container).toMatchSnapshot()
  })
})
